import { Package_State } from "../interface/package_state"

import * as fs from 'fs';
import * as path from 'path';
import { execSync } from 'child_process';

import * as validateStructureModule from "./validate_structure"
import * as buildAndTestModule from "./build_and_test"


const validate_structure = validateStructureModule.$$;
const build_and_test = buildAndTestModule.$$;


export type Parameters = {
    'path to package': string,
    'directory name': string,
    'build and test': boolean,
    'compare to published': boolean,
}

export function determine_package_state(
    $p: Parameters
): Package_State {
    // Use basename if node_name not provided

    const project_path = path.join($p['path to package'], $p["directory name"]);

    // 1. Determine Git State
    /**
     * Check git status to determine staged files, dirty working tree, and unpushed commits
     */
    function determine_git_state(project_path: string): Package_State['git'] {
        try {
            // Check for staged files
            const staged = execSync('git diff --cached --name-only', { cwd: project_path, encoding: 'utf8' }).trim();
            const has_staged_files = staged.length > 0;

            // Check for dirty working tree (unstaged changes)
            const unstaged = execSync('git diff --name-only', { cwd: project_path, encoding: 'utf8' }).trim();
            const untracked = execSync('git ls-files --others --exclude-standard', { cwd: project_path, encoding: 'utf8' }).trim();
            const has_dirty_working_tree = unstaged.length > 0 || untracked.length > 0;

            // Check for unpushed commits
            let has_unpushed_commits = false;
            try {
                // Get the current branch
                const current_branch = execSync('git rev-parse --abbrev-ref HEAD', { cwd: project_path, encoding: 'utf8' }).trim();

                // Check if remote branch exists and compare
                try {
                    const local_commit = execSync(`git rev-parse ${current_branch}`, { cwd: project_path, encoding: 'utf8' }).trim();
                    const remote_commit = execSync(`git rev-parse origin/${current_branch}`, { cwd: project_path, encoding: 'utf8' }).trim();
                    has_unpushed_commits = local_commit !== remote_commit;
                } catch {
                    // Remote branch might not exist, assume unpushed commits
                    has_unpushed_commits = true;
                }
            } catch {
                // Error getting branch info, assume no unpushed commits
                has_unpushed_commits = false;
            }

            return {
                'staged files': has_staged_files,
                'dirty working tree': has_dirty_working_tree,
                'unpushed commits': has_unpushed_commits
            };
        } catch (err) {
            // If git commands fail, assume safe defaults
            return {
                'staged files': false,
                'dirty working tree': false,
                'unpushed commits': false
            };
        }
    }

    const git_state = determine_git_state(project_path);

    // 2. Determine package info and dependencies
    /**
     * Check package.json and determine package info and dependencies
     */
    function determine_package_and_dependencies(project_path: string, node_name: string): {
        package_name_in_sync: boolean,
        version: string,
        dependencies: Package_State['dependencies']
    } {
        const package_json_path = path.join(project_path, 'pub', 'package.json');

        if (!fs.existsSync(package_json_path)) {
            return {
                package_name_in_sync: true, // No package.json means no mismatch
                version: '0.0.0',
                dependencies: {}
            };
        }

        try {
            const package_content = JSON.parse(fs.readFileSync(package_json_path, 'utf8'));
            const package_name = package_content.name || node_name;
            const version = package_content.version || '0.0.0';
            const prod_dependencies = package_content.dependencies || {};

            // Check if package name matches directory name (node_name)
            const package_name_in_sync = package_name === node_name;

            // Process dependencies
            const dependencies: Package_State['dependencies'] = {};

            for (const [dep_name, dep_version] of Object.entries(prod_dependencies)) {
                const version_string = dep_version as string;

                // Check if this dependency exists as a sibling directory in the cluster
                let target_status: Package_State['dependencies'][string]['target'];

                const sibling_dep_path = path.join($p['path to package'], dep_name);
                
                if (fs.existsSync(sibling_dep_path) && fs.statSync(sibling_dep_path).isDirectory()) {
                    // Dependency exists as a sibling directory
                    // Check if it has a package.json to verify version
                    const sibling_package_json = path.join(sibling_dep_path, 'pub', 'package.json');
                    let is_up_to_date = false;

                    if (fs.existsSync(sibling_package_json)) {
                        try {
                            const sibling_package = JSON.parse(fs.readFileSync(sibling_package_json, 'utf8'));
                            const sibling_version = sibling_package.version;
                            // Simple version check - could be made more sophisticated
                            is_up_to_date = version_string.includes(sibling_version);
                        } catch {
                            // Error reading sibling package.json
                            is_up_to_date = false;
                        }
                    }

                    target_status = ['found', {
                        'dependency up to date': is_up_to_date
                    }];
                } else {
                    target_status = ['not found', null];
                }

                dependencies[dep_name] = {
                    'version': version_string,
                    'target': target_status
                };
            }

            return {
                package_name_in_sync,
                version,
                dependencies
            };
        } catch (err: any) {
            // Error reading package.json
            return {
                package_name_in_sync: true,
                version: '0.0.0',
                dependencies: {}
            };
        }
    }
    const { package_name_in_sync, version, dependencies } = determine_package_and_dependencies(project_path, $p['directory name']);

    // 3. Load structure.json and validate structure
    let structure_state: Package_State['structure'];
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

    // 4. Run build and test
    let test_state: Package_State['test'];
    if ($p['build and test']) {
        try {
            const build_test_result = build_and_test(project_path, {
                verbose: false,
                throw_on_error: false,
                skip_tests: false
            });

            if (build_test_result[0] === 'success') {
                test_state = ['success', null];
            } else {
                const [reason_type, reason_details] = build_test_result[1].reason;
                if (reason_type === 'build failing') {
                    test_state = ['failure', ['build', null]];
                } else if (reason_type === 'tests failing') {
                    // Extract failed test information if available
                    test_state = ['failure', ['test', { 'failed tests': [reason_details.details] }]];
                } else {
                    // Fallback for unknown error types
                    test_state = ['failure', ['build', null]];
                }
            }
        } catch (err: any) {
            // If build_and_test throws an error, treat it as build failure
            test_state = ['failure', ['build', null]];
        }
    } else {
        test_state = ['skipped', null];
    }

    // 5. Compare with published version
    let published_comparison: Package_State['published comparison'];
    if ($p['compare to published']) {
        // Check if package.json exists
        const package_json_path = path.join(project_path, 'pub', 'package.json');
        if (!fs.existsSync(package_json_path)) {
            published_comparison = ['could not compare', ['no package', null]];
        } else {
            const package_content = JSON.parse(fs.readFileSync(package_json_path, 'utf8'));
            const package_name = package_content.name;

            if (!package_name) {
                published_comparison = ['could not compare', ['no package name', null]];
            } else {
                // Check if package exists on npm
                try {
                    const npm_view_output = execSync(`npm view ${package_name} version`, {
                        stdio: 'pipe',
                        encoding: 'utf8'
                    }).trim();

                    if (!npm_view_output || npm_view_output.includes('npm ERR!')) {
                        published_comparison = ['could not compare', ['not published', null]];
                    } else {
                        // Package exists, check if it differs
                        const differs_module = require('./differs_from_published');
                        const differs = differs_module.differs_from_published(project_path);

                        if (differs) {
                            published_comparison = ['could compare', ['different', null]];
                        } else {
                            published_comparison = ['could compare', ['identical', null]];
                        }
                    }
                } catch (npmError) {
                    //determine if the error is due to package not found
                    if (npmError.stdout) {
                        const output = npmError.stdout.toString();
                        if (output.includes('E404')) {
                            published_comparison = ['could not compare', ['not published', null]];
                           
                        }
                    }
                    // Can't check npm - assume not published
                    published_comparison = ['could not compare', ['not published', null]];
                }
            }
        }
    } else {
        published_comparison = ['skipped', null];
    }

    return {
        'package name in sync with directory name': package_name_in_sync,
        'version': version,
        'git': git_state,
        'structure': structure_state,
        'test': test_state,
        'dependencies': dependencies,
        'published comparison': published_comparison
    };
}