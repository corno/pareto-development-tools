#!/usr/bin/env node

import { execSync } from 'child_process';
import * as path from 'path';

const test_base_dir = '/home/corno/workspace/pareto-development-tools/test';
const data_dir = '/home/corno/workspace/pareto-development-tools/data/test';

const args = process.argv.slice(2);
const overwrite_expected = args.includes('--overwrite-expected');

console.log('Running all tests...\n');
console.log('='.repeat(60));

let failed_tests = 0;
let passed_tests = 0;
const failed_test_types: string[] = [];

// Test 1: DOT file generation
console.log('\n1. Testing DOT file generation...');
try {
    const cmd = overwrite_expected 
        ? 'node ./dist/bin/test_dot_file_generation.js --overwrite-expected'
        : 'node ./dist/bin/test_dot_file_generation.js';
    execSync(cmd, {
        cwd: test_base_dir,
        stdio: 'inherit'
    });
    console.log('✓ DOT file generation test passed');
    passed_tests++;
} catch (err) {
    console.error('✗ DOT file generation test failed');
    failed_tests++;
    failed_test_types.push('dot_files');
}

// Test 2: SVG generation
console.log('\n2. Testing SVG generation...');
try {
    const cmd = overwrite_expected 
        ? 'node ./dist/bin/test_svg_generation.js --overwrite-expected'
        : 'node ./dist/bin/test_svg_generation.js';
    execSync(cmd, {
        cwd: test_base_dir,
        stdio: 'inherit'
    });
    console.log('✓ SVG generation test passed');
    passed_tests++;
} catch (err) {
    console.error('✗ SVG generation test failed');
    failed_tests++;
    failed_test_types.push('svgs');
}

// Test 3: Document generation (Cluster_State → Document JSON)
console.log('\n3. Testing Document generation...');
try {
    const cmd = overwrite_expected 
        ? 'node ./dist/bin/test_document_generation.js --overwrite-expected'
        : 'node ./dist/bin/test_document_generation.js';
    execSync(cmd, {
        cwd: test_base_dir,
        stdio: 'inherit'
    });
    console.log('✓ Document generation test passed');
    passed_tests++;
} catch (err) {
    console.error('✗ Document generation test failed');
    failed_tests++;
    failed_test_types.push('html_as_json');
}

// Test 4: HTML rendering (Document JSON → HTML)
console.log('\n4. Testing HTML rendering...');
try {
    const cmd = overwrite_expected 
        ? 'node ./dist/bin/test_html_rendering.js --overwrite-expected'
        : 'node ./dist/bin/test_html_rendering.js';
    execSync(cmd, {
        cwd: test_base_dir,
        stdio: 'inherit'
    });
    console.log('✓ HTML rendering test passed');
    passed_tests++;
} catch (err) {
    console.error('✗ HTML rendering test failed');
    failed_tests++;
    failed_test_types.push('html');
}

// Summary
console.log('\n' + '='.repeat(60));
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
