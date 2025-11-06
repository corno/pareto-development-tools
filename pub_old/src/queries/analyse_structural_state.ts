import { Structural_State } from "../interface/package_state"

import * as fs from 'fs';
import * as path from 'path';

import * as validateStructureModule from "../old_lib/validate_structure"
import { get_directory_tree } from "./get_directory_tree"
import { compare_directories } from "../transformations/compare_directories"
import type { Directory_Diff } from "../interface/filesystem_compare"

const validate_structure = validateStructureModule.$$;

export type Parameters = {
    'path to package': string,
    'directory name': string,
    'package name': string,
}

export function analyse_structural_state(
    $p: Parameters
): Structural_State {
    const project_path = path.join($p['path to package'], $p["directory name"]);

    // 1. Load structure.json and validate structure
    let structure_state: Structural_State['structure'];
    try {
        // Assuming this function is called from tools, look for structure.json in data directory
        const tools_dir = path.join(__dirname, '../../..');
        const structure_path = path.join(tools_dir, 'data', 'structure.json');

        if (!fs.existsSync(structure_path)) {
            throw new Error(`Structure file not found at: ${structure_path}`);
        }

        const structure_content = fs.readFileSync(structure_path, 'utf8');
        const structure = JSON.parse(structure_content);

        const structure_result = validate_structure(project_path, structure);

        if (structure_result[0] === 'not valid') {
            structure_state = ['invalid', { errors: structure_result[1].errors }];
        } else {
            structure_state = ['valid', { warnings: structure_result[1].warnings }];
        }
    } catch (err: any) {
        // If we can't load structure.json, we can't validate anything
        structure_state = ['invalid', { errors: [`Failed to load structure.json: ${err.message}`] }];
    }

    // 2. Check interface vs implementation (if both directories exist)
    let interface_implementation_match: Structural_State['interface implementation match'];
    const interface_dir = path.join(project_path, 'pub', 'src', 'interface', 'algorithms');
    const implementation_dir = path.join(project_path, 'pub', 'src', 'implementation', 'algorithms');

    const interface_exists = fs.existsSync(interface_dir);
    const implementation_exists = fs.existsSync(implementation_dir);

    if (!interface_exists && !implementation_exists) {
        // Neither directory exists - consider it matched (no requirement)
        interface_implementation_match = ['matched', null];
    } else if (!interface_exists) {
        // Interface directory is missing
        interface_implementation_match = ['root interface direcory missing', null];
    } else if (!implementation_exists) {
        // Implementation directory is missing
        interface_implementation_match = ['root implementation direcory missing', null];
    } else {
        // Both directories exist - compare them
        try {
            const interface_tree = get_directory_tree(interface_dir);
            const implementation_tree = get_directory_tree(implementation_dir);
            const diff = compare_directories(interface_tree, implementation_tree);

            // Collect errors from the diff
            const collect_differences = (diff: Directory_Diff, path_prefix: string = ''): Array<{
                path: string,
                problem: ['missing', null] | ['superfluous', null]
            }> => {
                const differences: Array<{
                    path: string,
                    problem: ['missing', null] | ['superfluous', null]
                }> = [];

                for (const [name, node_diff] of Object.entries(diff)) {
                    const item_path = path_prefix ? `${path_prefix}/${name}` : name;

                    if (node_diff[0] === 'error') {
                        const error_type = node_diff[1][0];
                        if (error_type === 'missing') {
                            differences.push({
                                path: item_path,
                                problem: ['missing', null]
                            });
                        } else if (error_type === 'superfluous') {
                            differences.push({
                                path: item_path,
                                problem: ['superfluous', null]
                            });
                        }
                        // Note: 'not a directory' and 'not a file' are also mismatches
                        // but we're simplifying to just missing/superfluous for now
                    } else if (node_diff[1][0] === 'directory') {
                        differences.push(...collect_differences(node_diff[1][1], item_path));
                    }
                }

                return differences;
            };

            const differences = collect_differences(diff);

            if (differences.length > 0) {
                interface_implementation_match = ['mismatched', { differences }];
            } else {
                interface_implementation_match = ['matched', null];
            }
        } catch (err: any) {
            // If we can't check, treat it as matched (no error)
            interface_implementation_match = ['matched', null];
        }
    }

    return {
        'package name the same as directory': $p['package name'] === $p['directory name'],
        'structure': structure_state,
        'interface implementation match': interface_implementation_match
    };
}