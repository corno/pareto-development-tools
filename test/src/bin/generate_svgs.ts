#!/usr/bin/env node

import * as fs from 'fs';
import * as path from 'path';
import { execSync } from 'child_process';
import { project_cluster_state_to_dot } from 'pareto-development-tools/dist/old_lib/project_cluster_state_to_dot';
import type { Cluster_State } from 'pareto-development-tools/dist/interface/package_state';

const args = process.argv.slice(2);
const overwrite_expected = args.includes('--overwrite-expected');

const data_dir = path.join(__dirname, '../../../data');
const analysed_structures_dir = path.join(data_dir, 'test/analysed_structures');
const svgs_dir = path.join(data_dir, 'test/svgs');
const expected_dir = path.join(svgs_dir, 'expected');
const actual_dir = path.join(svgs_dir, 'actual');

console.log('Generating SVGs from analysed structures...\n');

// Check if GraphViz is available
try {
    execSync('which dot', { stdio: 'pipe' });
} catch {
    console.error('❌ Error: GraphViz (dot command) not found. Please install GraphViz first.');
    console.error('On Ubuntu/Debian: sudo apt-get install graphviz');
    console.error('On CentOS/RHEL: sudo yum install graphviz');
    console.error('On macOS: brew install graphviz');
    process.exit(1);
}

// Clear actual directory
if (fs.existsSync(actual_dir)) {
    const files = fs.readdirSync(actual_dir);
    for (const file of files) {
        fs.unlinkSync(path.join(actual_dir, file));
    }
    console.log(`✓ Cleared ${actual_dir}`);
} else {
    fs.mkdirSync(actual_dir, { recursive: true });
    console.log(`✓ Created ${actual_dir}`);
}

// If overwrite expected flag is set, clear expected directory
if (overwrite_expected) {
    if (fs.existsSync(expected_dir)) {
        const files = fs.readdirSync(expected_dir);
        for (const file of files) {
            fs.unlinkSync(path.join(expected_dir, file));
        }
        console.log(`✓ Cleared ${expected_dir}`);
    } else {
        fs.mkdirSync(expected_dir, { recursive: true });
        console.log(`✓ Created ${expected_dir}`);
    }
}

// Ensure expected directory exists
if (!fs.existsSync(expected_dir)) {
    fs.mkdirSync(expected_dir, { recursive: true });
}

// Read all JSON files from analysed_structures directory
const json_files = fs.readdirSync(analysed_structures_dir)
    .filter(file => file.endsWith('.json'));

console.log(`\nFound ${json_files.length} analysed structure(s) to process\n`);

let differences_found = 0;
let matches_found = 0;

for (const json_file of json_files) {
    const base_name = path.basename(json_file, '.json');
    const svg_name = `${base_name}.svg`;
    
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
    
    // Create temporary DOT file
    const temp_dot_file = `/tmp/temp-${Date.now()}-${base_name}.dot`;
    fs.writeFileSync(temp_dot_file, dot_content);
    
    // Generate SVG from DOT
    const generated_svg_path = `/tmp/temp-${Date.now()}-${base_name}.svg`;
    try {
        execSync(`dot -Tsvg ${temp_dot_file} -o ${generated_svg_path}`, { stdio: 'pipe' });
    } catch (err: any) {
        console.error(`  ❌ Error generating SVG: ${err.message}`);
        fs.unlinkSync(temp_dot_file);
        continue;
    }
    
    // Read the generated SVG
    const generated_svg_content = fs.readFileSync(generated_svg_path, 'utf8');
    
    // Clean up temporary files
    fs.unlinkSync(temp_dot_file);
    fs.unlinkSync(generated_svg_path);
    
    // If overwrite expected, write to expected directory
    if (overwrite_expected) {
        const expected_path = path.join(expected_dir, svg_name);
        fs.writeFileSync(expected_path, generated_svg_content);
        console.log(`  ✓ Written to expected: ${svg_name}`);
    } else {
        // Compare with expected
        const expected_path = path.join(expected_dir, svg_name);
        
        if (!fs.existsSync(expected_path)) {
            // No expected file exists, write to actual
            const actual_path = path.join(actual_dir, svg_name);
            fs.writeFileSync(actual_path, generated_svg_content);
            console.log(`  ⚠️  No expected file found, written to actual: ${svg_name}`);
            differences_found++;
        } else {
            // Compare with expected
            const expected_content = fs.readFileSync(expected_path, 'utf8');
            
            if (generated_svg_content === expected_content) {
                console.log(`  ✓ Matches expected: ${svg_name}`);
                matches_found++;
            } else {
                // Write to actual directory
                const actual_path = path.join(actual_dir, svg_name);
                fs.writeFileSync(actual_path, generated_svg_content);
                console.log(`  ❌ Differs from expected, written to actual: ${svg_name}`);
                differences_found++;
            }
        }
    }
}

console.log('\n' + '='.repeat(60));
if (overwrite_expected) {
    console.log(`✓ Baseline set: ${json_files.length} SVG(s) written to expected directory`);
} else {
    console.log(`Summary:`);
    console.log(`  - ${matches_found} file(s) match expected`);
    console.log(`  - ${differences_found} file(s) differ or missing expected`);
    
    if (differences_found > 0) {
        console.log(`\n⚠️  Differences found! Check files in: ${actual_dir}`);
        console.log(`To set new baseline, run with: --overwrite-expected`);
        process.exit(1);
    } else {
        console.log(`\n✓ All generated SVGs match expected`);
    }
}
