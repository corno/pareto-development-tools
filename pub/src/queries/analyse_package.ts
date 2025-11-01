import { Package_State } from "../interface/package_state"

import * as fs from 'fs';
import * as path from 'path';

import { analyse_pre_publish_state } from "./analyse_pre_publish_state"

export type Parameters = {
    'path to package': string,
    'directory name': string,
    'build and test': boolean,
    'compare to published': boolean,
}

export function determine_package_state(
    $p: Parameters
): Package_State {
    const project_path = path.join($p['path to package'], $p["directory name"]);

    // Determine package info
    function determine_package_info(project_path: string, node_name: string): {
        package_name: string,
        version: string | null
    } {
        const package_json_path = path.join(project_path, 'pub', 'package.json');

        if (!fs.existsSync(package_json_path)) {
            return {
                package_name: node_name,
                version: null
            };
        }

        try {
            const package_content = JSON.parse(fs.readFileSync(package_json_path, 'utf8'));
            const package_name = package_content.name || node_name;
            const version = package_content.version || null;

            return {
                package_name,
                version
            };
        } catch (err: any) {
            // Error reading package.json
            return {
                package_name: node_name,
                version: null
            };
        }
    }

    const { package_name, version } = determine_package_info(project_path, $p['directory name']);

    // Analyse pre-publish state
    const pre_publish_state = analyse_pre_publish_state({
        'path to package': $p['path to package'],
        'directory name': $p['directory name'],
        'package name': package_name,
        'build and test': $p['build and test'],
        'compare to published': $p['compare to published']
    });

    return {
        'package name in package.json': package_name,
        'version': version,
        'pre-publish': pre_publish_state
    };
}