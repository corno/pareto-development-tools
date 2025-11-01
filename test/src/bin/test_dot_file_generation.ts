#!/usr/bin/env node

import { $$ as test_runner } from '../lib/test_runner';
import { project_cluster_state_to_dot } from 'pareto-development-tools/dist/old_lib/project_cluster_state_to_dot';
import type { Cluster_State } from 'pareto-development-tools/dist/interface/package_state';

const args = process.argv.slice(2);
const overwrite_expected = args.includes('--overwrite-expected');

console.log('Generating DOT files from analysed structures...\n');

const success = test_runner({
    'input_dir_name': 'analysed_structures',
    'output_dir_name': 'dot_files',
    'transformer': (input_content: string): string => {
        const cluster_state: Cluster_State = JSON.parse(input_content);
        const dot_content = project_cluster_state_to_dot(cluster_state, {
            'include_legend': false,
            'cluster_path': 'test_cluster',
            'show_warnings': false,
            'time stamp': 'FIXED_TIMESTAMP_FOR_TESTING'
        });
        return dot_content;
    },
    'overwrite_expected': overwrite_expected
});

process.exit(success ? 0 : 1);
