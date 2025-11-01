#!/usr/bin/env node

import * as fs from 'fs';
import * as path from 'path';

export type TestRunner = {
    'input_dir_name': string,
    'output_dir_name': string,
    'target_extension': string,  // e.g., 'json', 'txt', 'dot'
    'transformer': (input_content: string, filename_without_extension: string) => string,
    'overwrite_expected': boolean
}

export const $$ = ($p: TestRunner): boolean => {
    const data_dir = path.join(__dirname, '../../../data');
    const input_dir = path.join(data_dir, 'test', $p.input_dir_name);
    const test_data_dir = path.join(data_dir, 'test');
    const expected_dir = path.join(test_data_dir, 'expected');
    const actual_dir = path.join(test_data_dir, 'actual');
    
    console.log('='.repeat(60));
    console.log(`Running test: ${$p.input_dir_name} → ${$p.output_dir_name}\n`);
    
    // Check if input directory exists
    if (!fs.existsSync(input_dir)) {
        console.error(`❌ Input directory not found: ${input_dir}`);
        return false;
    }
    
    // Clear/create actual output directory
    const actual_output_dir = path.join(actual_dir, $p.output_dir_name);
    if (fs.existsSync(actual_output_dir)) {
        const files = fs.readdirSync(actual_output_dir);
        for (const file of files) {
            fs.unlinkSync(path.join(actual_output_dir, file));
        }
        console.log(`✓ Cleared ${actual_output_dir}`);
    } else {
        fs.mkdirSync(actual_output_dir, { recursive: true });
        console.log(`✓ Created ${actual_output_dir}`);
    }
    
    // Clear/create expected output directory if overwrite flag is set
    const expected_output_dir = path.join(expected_dir, $p.output_dir_name);
    if ($p.overwrite_expected) {
        // Only clear if the directory exists and has files
        if (fs.existsSync(expected_output_dir)) {
            const files = fs.readdirSync(expected_output_dir);
            console.log(`⚠️  Overwrite mode: Will replace ${files.length} existing expected file(s) in ${$p.output_dir_name}`);
            for (const file of files) {
                fs.unlinkSync(path.join(expected_output_dir, file));
            }
            console.log(`✓ Cleared ${expected_output_dir}`);
        } else {
            fs.mkdirSync(expected_output_dir, { recursive: true });
            console.log(`✓ Created ${expected_output_dir}`);
        }
    } else {
        // Ensure expected output directory exists
        if (!fs.existsSync(expected_output_dir)) {
            fs.mkdirSync(expected_output_dir, { recursive: true });
        }
    }
    
    // Read all files from input directory
    const input_files = fs.readdirSync(input_dir);
    
    console.log(`\nFound ${input_files.length} input file(s) to process\n`);
    
    let differences_found = 0;
    let matches_found = 0;
    
    for (const input_file of input_files) {
        const base_name = path.basename(input_file, path.extname(input_file));
        const output_name = `${base_name}.${$p.target_extension}`;
        
        try {
            // Read input file
            const input_path = path.join(input_dir, input_file);
            const input_content = fs.readFileSync(input_path, 'utf8');
            
            // Transform input to output
            const output_content = $p.transformer(input_content, base_name);
            
            // If overwrite expected, write to expected directory
            if ($p.overwrite_expected) {
                const expected_path = path.join(expected_output_dir, output_name);
                fs.writeFileSync(expected_path, output_content);
                console.log(`\x1b[32m${base_name} ✓\x1b[0m`);
            } else {
                // Compare with expected
                const expected_path = path.join(expected_output_dir, output_name);
                
                if (!fs.existsSync(expected_path)) {
                    // No expected file exists, write to actual
                    const actual_path = path.join(actual_output_dir, output_name);
                    fs.writeFileSync(actual_path, output_content);
                    console.log(`\x1b[31m${base_name} ❌\x1b[0m`);
                    differences_found++;
                } else {
                    // Compare with expected
                    const expected_content = fs.readFileSync(expected_path, 'utf8');
                    
                    if (output_content === expected_content) {
                        console.log(`\x1b[32m${base_name} ✓\x1b[0m`);
                        matches_found++;
                    } else {
                        // Write to actual directory
                        const actual_path = path.join(actual_output_dir, output_name);
                        fs.writeFileSync(actual_path, output_content);
                        console.log(`\x1b[31m${base_name} ❌\x1b[0m`);
                        differences_found++;
                    }
                }
            }
        } catch (error) {
            console.log(`\x1b[31m${base_name} ❌\x1b[0m`);
            differences_found++;
        }
    }
    
    console.log('\n' + '-'.repeat(60));
    if ($p.overwrite_expected) {
        console.log(`✓ Baseline set: ${input_files.length} file(s) written to expected directory`);
        console.log('='.repeat(60));
        return true;
    } else {
        console.log(`Summary:`);
        console.log(`  - ${matches_found} file(s) match expected`);
        console.log(`  - ${differences_found} file(s) differ or missing expected`);
        
        if (differences_found > 0) {
            console.log(`\n⚠️  Differences found! Check files in: ${actual_output_dir}`);
            console.log(`To set new baseline, run with: --overwrite-expected`);
            console.log('='.repeat(60));
            return false;
        } else {
            console.log(`\n✓ All generated files match expected`);
            console.log('='.repeat(60));
            return true;
        }
    }
}