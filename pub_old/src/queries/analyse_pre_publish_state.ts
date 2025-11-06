import { Pre_Publish_State } from "../interface/package_state"

import * as fs from 'fs';
import * as path from 'path';
import { execSync } from 'child_process';

import { compare_with_published } from "./compare_with_published"
import { analyse_pre_commit_state } from "./analyse_pre_commit_state"

export type Parameters = {
    'path to package': string,
    'directory name': string,
    'package name': string,
}

export function analyse_pre_publish_state(
    $p: Parameters
): Pre_Publish_State {
    const project_path = path.join($p['path to package'], $p["directory name"]);

    // 1. Determine Git State
    function determine_git_state(project_path: string): Pre_Publish_State['git'] {
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

    // 2. Determine dependencies
    function determine_dependencies(project_path: string): Pre_Publish_State['dependencies'] {
        const package_json_path = path.join(project_path, 'pub', 'package.json');

        if (!fs.existsSync(package_json_path)) {
            return {};
        }

        try {
            const package_content = JSON.parse(fs.readFileSync(package_json_path, 'utf8'));
            const prod_dependencies = package_content.dependencies || {};

            // Process dependencies
            const dependencies: Pre_Publish_State['dependencies'] = {};

            for (const [dep_name, dep_version] of Object.entries(prod_dependencies)) {
                const version_string = dep_version as string;

                // Check if this dependency exists as a sibling directory in the cluster
                let target_status: Pre_Publish_State['dependencies'][string]['target'];

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

            return dependencies;
        } catch (err: any) {
            // Error reading package.json
            return {};
        }
    }

    const dependencies = determine_dependencies(project_path);

    // 3. Compare with published version (always)
    let published_comparison: Pre_Publish_State['published comparison'];
    const comparison_result = compare_with_published({ 'package path': project_path });
    
    if (comparison_result[0] === 'could not compare') {
        const [_, reason] = comparison_result;
        
        switch (reason[0]) {
            case 'no package json':
                published_comparison = ['could not compare', ['no package', null]];
                break;
            case 'no package name':
                published_comparison = ['could not compare', ['no package name', null]];
                break;
            case 'not published':
                published_comparison = ['could not compare', ['not published', null]];
                break;
        }
    } else {
        // comparison_result[0] === 'could compare'
        const [_, result] = comparison_result;
        
        if (result[0] === 'identical') {
            published_comparison = ['could compare', ['identical', null]];
        } else {
            // result[0] === 'different'
            published_comparison = ['could compare', ['different', null]];
        }
    }

    // 4. Analyse pre-commit state
    const pre_commit_state = analyse_pre_commit_state({
        'path to package': $p['path to package'],
        'directory name': $p['directory name'],
        'package name': $p['package name']
    });

    return {
        'pre-commit': pre_commit_state,
        'git': git_state,
        'dependencies': dependencies,
        'published comparison': published_comparison
    };
}