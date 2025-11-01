#!/usr/bin/env node

import { $$ as test_runner } from '../lib/test_runner';
import cluster_state_to_document from 'pareto-development-tools/dist/old_lib/cluster_state_to_document';
import type { Cluster_State } from 'pareto-development-tools/dist/interface/package_state';

const args = process.argv.slice(2);
const overwrite_expected = args.includes('--overwrite-expected');

console.log('Generating Document JSON from analysed structures...\n');

const success = test_runner({
    'input_dir_name': 'analysed_structures',
    'output_dir_name': 'html_as_json',
    'target_extension': 'json',
    'transformer': (input_content: string): string => {
        const cluster_state: Cluster_State = JSON.parse(input_content);
        const document = cluster_state_to_document(cluster_state, {
            'time stamp': 'FIXED_TIMESTAMP_FOR_TESTING',
            'cluster path': 'test_cluster'
        });
        return JSON.stringify(document, null, 2);
    },
    'overwrite_expected': overwrite_expected
});

process.exit(success ? 0 : 1);
