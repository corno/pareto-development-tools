#!/usr/bin/env node

import * as fs from 'fs';
import * as path from 'path';
import render_document_to_html from 'pareto-development-tools/dist/old_lib/render_html_document';
import type { Document } from 'pareto-development-tools/dist/interface/html';

const args = process.argv.slice(2);
const overwrite_expected = args.includes('--overwrite-expected');

const data_dir = path.join(__dirname, '../../../data');
const test_data_dir = path.join(data_dir, 'test');
const expected_dir = path.join(test_data_dir, 'expected');
const actual_dir = path.join(test_data_dir, 'actual');

console.log('Generating HTML from Document JSON...\n');

// Source: expected/html_as_json
const source_json_dir = path.join(expected_dir, 'html_as_json');

if (!fs.existsSync(source_json_dir)) {
    console.error(`❌ Source directory not found: ${source_json_dir}`);
    console.error('Run test_document_generation first with --overwrite-expected');
    process.exit(1);
}

// Clear actual/html directory
const actual_html_dir = path.join(actual_dir, 'html');
if (fs.existsSync(actual_html_dir)) {
    const files = fs.readdirSync(actual_html_dir);
    for (const file of files) {
        fs.unlinkSync(path.join(actual_html_dir, file));
    }
    console.log(`✓ Cleared ${actual_html_dir}`);
} else {
    fs.mkdirSync(actual_html_dir, { recursive: true });
    console.log(`✓ Created ${actual_html_dir}`);
}

// If overwrite expected flag is set, clear expected/html directory
const expected_html_dir = path.join(expected_dir, 'html');
if (overwrite_expected) {
    if (fs.existsSync(expected_html_dir)) {
        const files = fs.readdirSync(expected_html_dir);
        for (const file of files) {
            fs.unlinkSync(path.join(expected_html_dir, file));
        }
        console.log(`✓ Cleared ${expected_html_dir}`);
    } else {
        fs.mkdirSync(expected_html_dir, { recursive: true });
        console.log(`✓ Created ${expected_html_dir}`);
    }
}

// Ensure expected/html directory exists
if (!fs.existsSync(expected_html_dir)) {
    fs.mkdirSync(expected_html_dir, { recursive: true });
}

// Read all JSON files from html_as_json directory
const json_files = fs.readdirSync(source_json_dir)
    .filter(file => file.endsWith('.json'));

console.log(`\nFound ${json_files.length} Document JSON file(s) to process\n`);

let differences_found = 0;
let matches_found = 0;

for (const json_file of json_files) {
    const base_name = path.basename(json_file, '.json');
    const html_name = `${base_name}.html`;
    
    console.log(`Processing ${json_file}...`);
    
    // Read the Document JSON
    const json_path = path.join(source_json_dir, json_file);
    const document: Document = JSON.parse(fs.readFileSync(json_path, 'utf8'));
    
    // Generate HTML content
    const html_content = render_document_to_html(document, {
        'cluster path': base_name,
        'time stamp': 'FIXED_TIMESTAMP_FOR_TESTING'
    });
    
    // If overwrite expected, write to expected directory
    if (overwrite_expected) {
        const expected_path = path.join(expected_html_dir, html_name);
        fs.writeFileSync(expected_path, html_content);
        console.log(`  ✓ Written to expected: ${html_name}`);
    } else {
        // Compare with expected
        const expected_path = path.join(expected_html_dir, html_name);
        
        if (!fs.existsSync(expected_path)) {
            // No expected file exists, write to actual
            const actual_path = path.join(actual_html_dir, html_name);
            fs.writeFileSync(actual_path, html_content);
            console.log(`  ⚠️  No expected file found, written to actual: ${html_name}`);
            differences_found++;
        } else {
            // Compare with expected
            const expected_content = fs.readFileSync(expected_path, 'utf8');
            
            if (html_content === expected_content) {
                console.log(`  ✓ Matches expected: ${html_name}`);
                matches_found++;
            } else {
                // Write to actual directory
                const actual_path = path.join(actual_html_dir, html_name);
                fs.writeFileSync(actual_path, html_content);
                console.log(`  ❌ Differs from expected, written to actual: ${html_name}`);
                differences_found++;
            }
        }
    }
}

console.log('\n' + '='.repeat(60));
if (overwrite_expected) {
    console.log(`✓ Baseline set: ${json_files.length} HTML file(s) written to expected directory`);
} else {
    console.log(`Summary:`);
    console.log(`  - ${matches_found} file(s) match expected`);
    console.log(`  - ${differences_found} file(s) differ or missing expected`);
    
    if (differences_found > 0) {
        console.log(`\n⚠️  Differences found! Check files in: ${actual_html_dir}`);
        console.log(`To set new baseline, run with: --overwrite-expected`);
        process.exit(1);
    } else {
        console.log(`\n✓ All generated HTML files match expected`);
    }
}
