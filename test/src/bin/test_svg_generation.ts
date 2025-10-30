#!/usr/bin/env node

import * as fs from 'fs';
import * as path from 'path';
import { dot_to_svg } from 'pareto-development-tools/dist/old_lib/dot_to_svg';

const args = process.argv.slice(2);
const overwrite_expected = args.includes('--overwrite-expected');

const data_dir = path.join(__dirname, '../../../data');
const test_data_dir = path.join(data_dir, 'test');
const expected_dir = path.join(test_data_dir, 'expected');
const actual_dir = path.join(test_data_dir, 'actual');
const dot_files_dir = path.join(expected_dir, 'dot_files');

console.log('Generating SVGs from DOT files...\n');

// Check if GraphViz is available
try {
    const { execSync } = require('child_process');
    execSync('which dot', { stdio: 'pipe' });
} catch {
    console.error('❌ Error: GraphViz (dot command) not found. Please install GraphViz first.');
    console.error('On Ubuntu/Debian: sudo apt-get install graphviz');
    console.error('On CentOS/RHEL: sudo yum install graphviz');
    console.error('On macOS: brew install graphviz');
    process.exit(1);
}

// Clear actual/svgs directory
const actual_svg_dir = path.join(actual_dir, 'svgs');
if (fs.existsSync(actual_svg_dir)) {
    const files = fs.readdirSync(actual_svg_dir);
    for (const file of files) {
        fs.unlinkSync(path.join(actual_svg_dir, file));
    }
    console.log(`✓ Cleared ${actual_svg_dir}`);
} else {
    fs.mkdirSync(actual_svg_dir, { recursive: true });
    console.log(`✓ Created ${actual_svg_dir}`);
}

// If overwrite expected flag is set, clear expected/svgs directory
const expected_svg_dir = path.join(expected_dir, 'svgs');
if (overwrite_expected) {
    if (fs.existsSync(expected_svg_dir)) {
        const files = fs.readdirSync(expected_svg_dir);
        for (const file of files) {
            fs.unlinkSync(path.join(expected_svg_dir, file));
        }
        console.log(`✓ Cleared ${expected_svg_dir}`);
    } else {
        fs.mkdirSync(expected_svg_dir, { recursive: true });
        console.log(`✓ Created ${expected_svg_dir}`);
    }
}

// Ensure expected/svgs directory exists
if (!fs.existsSync(expected_svg_dir)) {
    fs.mkdirSync(expected_svg_dir, { recursive: true });
}

// Read all DOT files from expected dot_files directory
const dot_files = fs.readdirSync(dot_files_dir)
    .filter(file => file.endsWith('.dot'));

console.log(`\nFound ${dot_files.length} DOT file(s) to process\n`);

let differences_found = 0;
let matches_found = 0;

for (const dot_file of dot_files) {
    const base_name = path.basename(dot_file, '.dot');
    const svg_name = `${base_name}.svg`;
    
    console.log(`Processing ${dot_file}...`);
    
    // Read the DOT file
    const dot_path = path.join(dot_files_dir, dot_file);
    const dot_content = fs.readFileSync(dot_path, 'utf8');
    
    // Convert DOT to SVG
    let svg_content: string;
    try {
        svg_content = dot_to_svg(dot_content);
    } catch (err: any) {
        console.error(`  ❌ Error converting to SVG: ${err.message}`);
        differences_found++;
        continue;
    }
    
    // If overwrite expected, write to expected directory
    if (overwrite_expected) {
        const expected_path = path.join(expected_svg_dir, svg_name);
        fs.writeFileSync(expected_path, svg_content);
        console.log(`  ✓ Written to expected: ${svg_name}`);
    } else {
        // Compare with expected
        const expected_path = path.join(expected_svg_dir, svg_name);
        
        if (!fs.existsSync(expected_path)) {
            // No expected file exists, write to actual
            const actual_path = path.join(actual_svg_dir, svg_name);
            fs.writeFileSync(actual_path, svg_content);
            console.log(`  ⚠️  No expected file found, written to actual: ${svg_name}`);
            differences_found++;
        } else {
            // Compare with expected
            const expected_content = fs.readFileSync(expected_path, 'utf8');
            
            if (svg_content === expected_content) {
                console.log(`  ✓ Matches expected: ${svg_name}`);
                matches_found++;
            } else {
                // Write to actual directory
                const actual_path = path.join(actual_svg_dir, svg_name);
                fs.writeFileSync(actual_path, svg_content);
                console.log(`  ❌ Differs from expected, written to actual: ${svg_name}`);
                differences_found++;
            }
        }
    }
}

console.log('\n' + '='.repeat(60));
if (overwrite_expected) {
    console.log(`✓ Baseline set: ${dot_files.length} SVG(s) written to expected directory`);
} else {
    console.log(`Summary:`);
    console.log(`  - ${matches_found} file(s) match expected`);
    console.log(`  - ${differences_found} file(s) differ or missing expected`);
    
    if (differences_found > 0) {
        console.log(`\n⚠️  Differences found! Check files in: ${actual_svg_dir}`);
        console.log(`To set new baseline, run with: --overwrite-expected`);
        process.exit(1);
    } else {
        console.log(`\n✓ All generated SVGs match expected`);
    }
}
