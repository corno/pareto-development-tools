#!/usr/bin/env node

import { execSync } from 'child_process';
import * as path from 'path';
import { $$ as test_runner, TestRunner } from '../lib/test_runner';
import cluster_state_to_document from 'pareto-development-tools/dist/old_lib/cluster_state_to_document';
import { project_cluster_state_to_dot } from 'pareto-development-tools/dist/old_lib/project_cluster_state_to_dot';
import { dot_to_svg } from 'pareto-development-tools/dist/old_lib/dot_to_svg';
import { cluster_state_to_html } from 'pareto-development-tools/dist/old_lib/cluster_state_to_html';
import render_document_to_html from 'pareto-development-tools/dist/old_lib/render_html_document';
import * as state_to_analysis_result_module from 'pareto-development-tools/dist/transformations/state_to_analysis_result';
import type { Cluster_State, Package_State } from 'pareto-development-tools/dist/interface/package_state';
import type { Package_Analysis_Result, Cluster_Analysis_Result } from 'pareto-development-tools/dist/interface/analysis_result';
import type { Document } from 'pareto-development-tools/dist/interface/html';

const test_base_dir = '/home/corno/workspace/pareto-development-tools/test';
const data_dir = '/home/corno/workspace/pareto-development-tools/data/test';

const args = process.argv.slice(2);
const overwrite_expected = args.includes('--overwrite-expected');
const specific_test = args.find(arg => arg.startsWith('--test='))?.split('=')[1];

console.log('Running all tests...\n');
console.log('-'.repeat(60));

let failed_tests = 0;
let passed_tests = 0;
const failed_test_types: string[] = [];

// Define all tests to run
const tests: Array<{ name: string, config: TestRunner }> = [
    {
        name: 'DOT file generation',
        config: {
            'input_dir_name': 'analysed_structures',
            'output_dir_name': 'dot_files',
            'target_extension': 'dot',
            'transformer': (input_content: string, filename: string): string => {
                const cluster_state: Cluster_State = JSON.parse(input_content);
                return project_cluster_state_to_dot(cluster_state, {
                    'include_legend': true,
                    'cluster_path': filename,
                    'show_warnings': false,
                    'time stamp': 'FIXED_TIMESTAMP_FOR_TESTING'
                });
            },
            'overwrite_expected': overwrite_expected && (!specific_test || specific_test === 'dot')
        }
    },
    {
        name: 'Document generation',
        config: {
            'input_dir_name': 'analysed_structures',
            'output_dir_name': 'html_as_json',
            'target_extension': 'json',
            'transformer': (input_content: string, filename: string): string => {
                const cluster_state: Cluster_State = JSON.parse(input_content);
                const document = cluster_state_to_document(cluster_state, {
                    'time stamp': 'FIXED_TIMESTAMP_FOR_TESTING',
                    'cluster path': filename
                });
                return JSON.stringify(document, null, 2);
            },
            'overwrite_expected': overwrite_expected
        }
    },
    {
        name: 'Package State to Analysis Result transformation',
        config: {
            'input_dir_name': 'analysed_structures',
            'output_dir_name': 'analysis_results',
            'target_extension': 'json',
            'transformer': (input_content: string, filename: string): string => {
                const cluster_state = JSON.parse(input_content);
                
                if (cluster_state[0] === 'cluster') {
                    const cluster_data = cluster_state[1];
                    const projects: { [key: string]: Package_Analysis_Result } = {};
                    
                    for (const [project_name, project_data] of Object.entries(cluster_data.projects)) {
                        if (project_data[0] === 'project') {
                            const package_state = project_data[1] as Package_State;
                            const analysis_result = state_to_analysis_result_module.package_state_to_analysis_result(package_state);
                            projects[project_name] = analysis_result;
                        } else {
                            const not_project_analysis: Package_Analysis_Result = {
                                'category': 'project',
                                'outcome': `${project_name}: not a project`,
                                'status': ['warning', null],
                                'children': []
                            };
                            projects[project_name] = not_project_analysis;
                        }
                    }
                    
                    const cluster_result: Cluster_Analysis_Result = projects;
                    
                    return JSON.stringify(cluster_result, null, 2);
                } else {
                    const error_result: Cluster_Analysis_Result = {
                        'invalid_cluster': {
                            'category': 'cluster',
                            'outcome': 'not found or invalid',
                            'status': ['issue', null],
                            'children': []
                        }
                    };
                    return JSON.stringify(error_result, null, 2);
                }
            },
            'overwrite_expected': overwrite_expected
        }
    },
    {
        name: 'SVG generation',
        config: {
            'input_dir_name': 'expected/dot_files',
            'output_dir_name': 'svgs',
            'target_extension': 'svg',
            'transformer': (input_content: string, filename: string): string => {
                // Check if GraphViz is available
                try {
                    execSync('which dot', { stdio: 'pipe' });
                } catch {
                    throw new Error('GraphViz (dot command) not found. Please install GraphViz first.');
                }
                return dot_to_svg(input_content);
            },
            'overwrite_expected': overwrite_expected
        }
    },
    {
        name: 'HTML generation from cluster state',
        config: {
            'input_dir_name': 'analysed_structures',
            'output_dir_name': 'html',
            'target_extension': 'html',
            'transformer': (input_content: string, filename: string): string => {
                const cluster_state: Cluster_State = JSON.parse(input_content);
                return cluster_state_to_html(cluster_state, {
                    'time stamp': 'FIXED_TIMESTAMP_FOR_TESTING',
                    'cluster path': filename
                });
            },
            'overwrite_expected': overwrite_expected
        }
    },
    {
        name: 'HTML rendering from document JSON',
        config: {
            'input_dir_name': 'expected/html_as_json',
            'output_dir_name': 'html',
            'target_extension': 'html',
            'transformer': (input_content: string, filename: string): string => {
                const document: Document = JSON.parse(input_content);
                return render_document_to_html(document);
            },
            'overwrite_expected': overwrite_expected
        }
    }
];

// Run each test
for (let i = 0; i < tests.length; i++) {
    const test = tests[i];
    
    try {
        const success = test_runner(test.config);
        if (success) {
            passed_tests++;
        } else {
            failed_tests++;
            failed_test_types.push(test.config.output_dir_name);
        }
    } catch (err) {
        failed_tests++;
        failed_test_types.push(test.config.output_dir_name);
    }
}

// Summary
console.log('\n' + '-'.repeat(60));
console.log(`Test Summary:`);
console.log(`  - ${passed_tests} test(s) passed`);
console.log(`  - ${failed_tests} test(s) failed`);

if (failed_tests > 0) {
    console.log('\n❌ Some tests failed');
    
    // Open Beyond Compare for expected vs actual directories
    const expected_path = path.join(data_dir, 'expected');
    const actual_path = path.join(data_dir, 'actual');
    
    console.log(`\nOpening Beyond Compare...`);
    console.log(`  Expected: ${expected_path}`);
    console.log(`  Actual:   ${actual_path}`);
    
    try {
        execSync(`bcompare "${expected_path}" "${actual_path}" &`, {
            stdio: 'ignore'
        });
    } catch (err) {
        console.error(`  ⚠️  Could not open Beyond Compare. Make sure 'bcompare' is in your PATH.`);
    }
    
    process.exit(1);
} else {
    console.log('\n✓ All tests passed');
}
