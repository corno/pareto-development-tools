import * as _et from 'exupery-core-types'
import * as _ea from 'exupery-core-alg'

import { execSync } from 'child_process';
import * as path from 'path';
import * as fs from 'fs';
import { TestRunner } from '../interface/testrunner';

export const run_tests = (tests: _et.Dictionary<TestRunner>) => {

    const test_base_dir = '/home/corno/workspace/pareto-development-tools/test';
    const data_dir = '/home/corno/workspace/pareto-development-tools/data/test';

    const args = process.argv.slice(2);
    const overwrite_expected = args.includes('--overwrite-expected');
    const specific_test = args.find(arg => arg.startsWith('--test='))?.split('=')[1];

    // Clean the entire 'actual' directory before starting tests
    const actual_dir = path.join(data_dir, 'actual');
    if (fs.existsSync(actual_dir)) {
        // Remove all contents
        const entries = fs.readdirSync(actual_dir);
        for (const entry of entries) {
            const entry_path = path.join(actual_dir, entry);
            const stat = fs.statSync(entry_path);
            if (stat.isDirectory()) {
                fs.rmSync(entry_path, { recursive: true, force: true });
            } else {
                fs.unlinkSync(entry_path);
            }
        }
        console.log('✓ Cleaned actual directory\n');
    } else {
        fs.mkdirSync(actual_dir, { recursive: true });
        console.log('✓ Created actual directory\n');
    }

    console.log('Running all tests...\n');
    console.log('-'.repeat(60));

    let failed_tests = 0;
    let passed_tests = 0;
    const failed_test_types: string[] = [];


    // Run each test
    tests.map(($, key) => {

        try {
            const success = test_runner($, key, overwrite_expected);
            if (success) {
                passed_tests++;
            } else {
                failed_tests++;
                failed_test_types.push(key);
            }
        } catch (err) {
            failed_tests++;
            failed_test_types.push(key);
        }
    })

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

}


function to_snake_case(str: string): string {
    return str.toLowerCase().replace(/\s+/g, '_');
}

export const test_runner = ($p: TestRunner, name: string, overwrite_expected: boolean): boolean => {
    const data_dir = path.join(__dirname, '../../../data');
    const test_data_dir = path.join(data_dir, 'test');
    const fixtures_dir = path.join(test_data_dir, 'fixtures');
    const test_dir_name = to_snake_case(name);
    const input_dir = path.join(fixtures_dir, test_dir_name);
    const expected_dir = path.join(test_data_dir, 'expected');
    const actual_dir = path.join(test_data_dir, 'actual');

    console.log('='.repeat(60));
    console.log(`Running test: ${name}\n`);

    // Check if input directory exists
    if (!fs.existsSync(input_dir)) {
        console.error(`❌ Input directory not found: ${input_dir}`);
        return false;
    }

    // Ensure actual output directory exists
    const actual_output_dir = path.join(actual_dir, test_dir_name);
    if (!fs.existsSync(actual_output_dir)) {
        fs.mkdirSync(actual_output_dir, { recursive: true });
    }

    // Clear/create expected output directory if overwrite flag is set
    const expected_output_dir = path.join(expected_dir, test_dir_name);
    if (overwrite_expected) {
        // Only clear if the directory exists and has files
        if (fs.existsSync(expected_output_dir)) {
            const files = fs.readdirSync(expected_output_dir);
            console.log(`⚠️  Overwrite mode: Will replace ${files.length} existing expected file(s) in ${test_dir_name}`);
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
            if (overwrite_expected) {
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
            // Write error information to actual file so we can see what went wrong
            const actual_path = path.join(actual_output_dir, output_name);
            const error_content = `ERROR during transformation:\n${error instanceof Error ? error.stack : String(error)}`;
            fs.writeFileSync(actual_path, error_content);

            console.log(`\x1b[31m${base_name} ❌\x1b[0m`);
            console.log('\n' + '-'.repeat(60));
            console.error(`❌ FATAL ERROR during transformation of ${base_name}:`);
            console.error(error instanceof Error ? error.message : String(error));
            console.error(`Full error details written to: ${actual_path}`);
            console.error(`\nAborting test run due to transformation error.`);
            console.log('='.repeat(60));
            process.exit(1);
        }
    }

    console.log('\n' + '-'.repeat(60));
    if (overwrite_expected) {
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