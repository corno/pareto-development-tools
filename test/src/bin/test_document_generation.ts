#!/usr/bin/env node

import * as fs from 'fs';
import * as path from 'path';
import cluster_state_to_document from 'pareto-development-tools/dist/old_lib/cluster_state_to_document';
import type { Cluster_State } from 'pareto-development-tools/dist/interface/package_state';

const args = process.argv.slice(2);
const overwrite_expected = args.includes('--overwrite-expected');

const data_dir = path.join(__dirname, '../../../data');
const analysed_structures_dir = path.join(data_dir, 'test/analysed_structures');
const test_data_dir = path.join(data_dir, 'test');
const expected_dir = path.join(test_data_dir, 'expected');
const actual_dir = path.join(test_data_dir, 'actual');

console.log('Generating Document JSON from analysed structures...\n');

// Clear actual/html_as_json directory
const actual_json_dir = path.join(actual_dir, 'html_as_json');
if (fs.existsSync(actual_json_dir)) {
    const files = fs.readdirSync(actual_json_dir);
    for (const file of files) {
        fs.unlinkSync(path.join(actual_json_dir, file));
    }
    console.log(`✓ Cleared ${actual_json_dir}`);
} else {
    fs.mkdirSync(actual_json_dir, { recursive: true });
    console.log(`✓ Created ${actual_json_dir}`);
}

// If overwrite expected flag is set, clear expected/html_as_json directory
const expected_json_dir = path.join(expected_dir, 'html_as_json');
if (overwrite_expected) {
    if (fs.existsSync(expected_json_dir)) {
        const files = fs.readdirSync(expected_json_dir);
        for (const file of files) {
            fs.unlinkSync(path.join(expected_json_dir, file));
        }
        console.log(`✓ Cleared ${expected_json_dir}`);
    } else {
        fs.mkdirSync(expected_json_dir, { recursive: true });
        console.log(`✓ Created ${expected_json_dir}`);
    }
}

// Ensure expected/html_as_json directory exists
if (!fs.existsSync(expected_json_dir)) {
    fs.mkdirSync(expected_json_dir, { recursive: true });
}

// Read all JSON files from analysed_structures directory
const json_files = fs.readdirSync(analysed_structures_dir)
    .filter(file => file.endsWith('.json'));

console.log(`\nFound ${json_files.length} analysed structure(s) to process\n`);

let differences_found = 0;
let matches_found = 0;

for (const json_file of json_files) {
    const base_name = path.basename(json_file, '.json');
    const output_name = `${base_name}.json`;
    
    console.log(`Processing ${json_file}...`);
    
    // Read the cluster state JSON
    const json_path = path.join(analysed_structures_dir, json_file);
    const cluster_state: Cluster_State = JSON.parse(fs.readFileSync(json_path, 'utf8'));
    
    // Generate Document
    const document = cluster_state_to_document(cluster_state, {
        'time stamp': 'FIXED_TIMESTAMP_FOR_TESTING',
        'cluster path': base_name
    });
    
    const document_json = JSON.stringify(document, null, 2);
    
    // If overwrite expected, write to expected directory
    if (overwrite_expected) {
        const expected_path = path.join(expected_json_dir, output_name);
        fs.writeFileSync(expected_path, document_json);
        console.log(`  ✓ Written to expected: ${output_name}`);
    } else {
        // Compare with expected
        const expected_path = path.join(expected_json_dir, output_name);
        
        if (!fs.existsSync(expected_path)) {
            // No expected file exists, write to actual
            const actual_path = path.join(actual_json_dir, output_name);
            fs.writeFileSync(actual_path, document_json);
            console.log(`  ⚠️  No expected file found, written to actual: ${output_name}`);
            differences_found++;
        } else {
            // Compare with expected
            const expected_content = fs.readFileSync(expected_path, 'utf8');
            
            if (document_json === expected_content) {
                console.log(`  ✓ Matches expected: ${output_name}`);
                matches_found++;
            } else {
                // Write to actual directory
                const actual_path = path.join(actual_json_dir, output_name);
                fs.writeFileSync(actual_path, document_json);
                console.log(`  ❌ Differs from expected, written to actual: ${output_name}`);
                differences_found++;
            }
        }
    }
}

console.log('\n' + '='.repeat(60));
if (overwrite_expected) {
    console.log(`✓ Baseline set: ${json_files.length} Document JSON file(s) written to expected directory`);
} else {
    console.log(`Summary:`);
    console.log(`  - ${matches_found} file(s) match expected`);
    console.log(`  - ${differences_found} file(s) differ or missing expected`);
    
    if (differences_found > 0) {
        console.log(`\n⚠️  Differences found! Check files in: ${actual_json_dir}`);
        console.log(`To set new baseline, run with: --overwrite-expected`);
        process.exit(1);
    } else {
        console.log(`\n✓ All generated Document JSON files match expected`);
    }
}
