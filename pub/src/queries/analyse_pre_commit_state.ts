import { Pre_Commit_State } from "../interface/package_state"

import * as path from 'path';
import * as child_process from 'child_process';

import * as buildAndTestModule from "../old_lib/build_and_test"
import { analyse_structural_state } from "./analyse_structural_state"

const build_and_test = buildAndTestModule.$$;

export type Parameters = {
    'path to package': string,
    'directory name': string,
    'package name': string,
}

export function analyse_pre_commit_state(
    $p: Parameters
): Pre_Commit_State {
    const project_path = path.join($p['path to package'], $p["directory name"]);

    // 1. Analyse structural state
    const structural_state = analyse_structural_state({
        'path to package': $p['path to package'],
        'directory name': $p['directory name'],
        'package name': $p['package name']
    });

    // Clean git workspace and update dependencies
    try {
        // Clean ignored files
        child_process.execSync('git clean -fXd', { cwd: project_path, stdio: 'inherit' });
        
        // Clean tracked files that are now ignored
        child_process.execSync('git ls-files -ci --exclude-standard | xargs -r git rm --cached', { 
            cwd: project_path, 
            stdio: 'inherit',
            shell: '/bin/bash'
        });
        
        // Update to latest dependencies in pub directory
        const pubDir = path.join(project_path, 'pub');
        child_process.execSync('update2latest . dependencies', { cwd: pubDir, stdio: 'inherit' });
        child_process.execSync('npm install', { cwd: pubDir, stdio: 'inherit' });
        
        // Update to latest dependencies in test directory
        const testDir = path.join(project_path, 'test');
        child_process.execSync('update2latest . dependencies', { cwd: testDir, stdio: 'inherit' });
        child_process.execSync('npm install', { cwd: testDir, stdio: 'inherit' });
    } catch (error) {
        console.warn(`Warning: Some cleanup/update commands failed: ${error}`);
    }

    // 2. Run build and test (always)
    let test_state: Pre_Commit_State['test'];
    const build_test_result = build_and_test(project_path, {
        verbose: false,
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

    return {
        'test': test_state,
        'structural': structural_state
    };
}