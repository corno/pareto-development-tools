import { Pre_Commit_State } from "../interface/package_state"

import * as path from 'path';

import * as buildAndTestModule from "../old_lib/build_and_test"
import { analyse_structural_state } from "./analyse_structural_state"

const build_and_test = buildAndTestModule.$$;

export type Parameters = {
    'path to package': string,
    'directory name': string,
    'package name': string,
    'build and test': boolean,
}

export function analyse_pre_commit_state(
    $p: Parameters
): Pre_Commit_State {
    const project_path = path.join($p['path to package'], $p["directory name"]);

    // 1. Run build and test
    let test_state: Pre_Commit_State['test'];
    if ($p['build and test']) {
        try {
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
        } catch (err: any) {
            // If build_and_test throws an error, treat it as build failure
            test_state = ['failure', ['build', null]];
        }
    } else {
        test_state = ['skipped', null];
    }

    // 2. Analyse structural state
    const structural_state = analyse_structural_state({
        'path to package': $p['path to package'],
        'directory name': $p['directory name'],
        'package name': $p['package name']
    });

    return {
        'test': test_state,
        'structural': structural_state
    };
}