#!/usr/bin/env node

import * as fs from 'fs';
import * as path from 'path';
import { project_cluster_state_to_dot } from 'pareto-development-tools/dist/old_lib/project_cluster_state_to_dot';
import type { Cluster_State } from 'pareto-development-tools/dist/interface/package_state';

const args = process.argv.slice(2);
const overwrite_expected = args.includes('--overwrite-expected');

const data_dir = path.join(__dirname, '../../../data');
const analysed_structures_dir = path.join(data_dir, 'test/analysed_structures');
const test_data_dir = path.join(data_dir, 'test');
const expected_dir = path.join(test_data_dir, 'expected');
const actual_dir = path.join(test_data_dir, 'actual');

console.log('Generating DOT files from analysed structures...\n');

// Clear actual/dot_files directory
const actual_dot_dir = path.join(actual_dir, 'dot_files');
if (fs.existsSync(actual_dot_dir)) {
    const files = fs.readdirSync(actual_dot_dir);
    for (const file of files) {
        fs.unlinkSync(path.join(actual_dot_dir, file));
    }
    console.log(`✓ Cleared ${actual_dot_dir}`);
} else {
    fs.mkdirSync(actual_dot_dir, { recursive: true });
    console.log(`✓ Created ${actual_dot_dir}`);
}

// If overwrite expected flag is set, clear expected/dot_files directory
const expected_dot_dir = path.join(expected_dir, 'dot_files');
if (overwrite_expected) {
    if (fs.existsSync(expected_dot_dir)) {
        const files = fs.readdirSync(expected_dot_dir);
        for (const file of files) {
            fs.unlinkSync(path.join(expected_dot_dir, file));
        }
        console.log(`✓ Cleared ${expected_dot_dir}`);
    } else {
        fs.mkdirSync(expected_dot_dir, { recursive: true });
        console.log(`✓ Created ${expected_dot_dir}`);
    }
}

// Ensure expected/dot_files directory exists
if (!fs.existsSync(expected_dot_dir)) {
    fs.mkdirSync(expected_dot_dir, { recursive: true });
}

// Read all JSON files from analysed_structures directory
const json_files = fs.readdirSync(analysed_structures_dir)
    .filter(file => file.endsWith('.json'));

console.log(`\nFound ${json_files.length} analysed structure(s) to process\n`);

let differences_found = 0;
let matches_found = 0;

for (const json_file of json_files) {
    const base_name = path.basename(json_file, '.json');
    const dot_name = `${base_name}.dot`;
    
    console.log(`Processing ${json_file}...`);
    
    // Read the cluster state JSON
    const json_path = path.join(analysed_structures_dir, json_file);
    const cluster_state: Cluster_State = JSON.parse(fs.readFileSync(json_path, 'utf8'));
    
    // Generate DOT content
    const dot_content = project_cluster_state_to_dot(cluster_state, {
        include_legend: true,
        cluster_path: base_name,
        show_warnings: false,
        'time stamp': 'FIXED_TIMESTAMP_FOR_TESTING'
    });
    
    // If overwrite expected, write to expected directory
    if (overwrite_expected) {
        const expected_path = path.join(expected_dot_dir, dot_name);
        fs.writeFileSync(expected_path, dot_content);
        console.log(`  ✓ Written to expected: ${dot_name}`);
    } else {
        // Compare with expected
        const expected_path = path.join(expected_dot_dir, dot_name);
        
        if (!fs.existsSync(expected_path)) {
            // No expected file exists, write to actual
            const actual_path = path.join(actual_dot_dir, dot_name);
            fs.writeFileSync(actual_path, dot_content);
            console.log(`  ⚠️  No expected file found, written to actual: ${dot_name}`);
            differences_found++;
        } else {
            // Compare with expected
            const expected_content = fs.readFileSync(expected_path, 'utf8');
            
            if (dot_content === expected_content) {
                console.log(`  ✓ Matches expected: ${dot_name}`);
                matches_found++;
            } else {
                // Write to actual directory
                const actual_path = path.join(actual_dot_dir, dot_name);
                fs.writeFileSync(actual_path, dot_content);
                console.log(`  ❌ Differs from expected, written to actual: ${dot_name}`);
                differences_found++;
            }
        }
    }
}

console.log('\n' + '='.repeat(60));
if (overwrite_expected) {
    console.log(`✓ Baseline set: ${json_files.length} DOT file(s) written to expected directory`);
} else {
    console.log(`Summary:`);
    console.log(`  - ${matches_found} file(s) match expected`);
    console.log(`  - ${differences_found} file(s) differ or missing expected`);
    
    if (differences_found > 0) {
        console.log(`\n⚠️  Differences found! Check files in: ${actual_dot_dir}`);
        console.log(`To set new baseline, run with: --overwrite-expected`);
        process.exit(1);
    } else {
        console.log(`\n✓ All generated DOT files match expected`);
    }
}
