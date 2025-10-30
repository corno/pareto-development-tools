#!/usr/bin/env node

import { execSync } from 'child_process';

const test_base_dir = '/home/corno/workspace/pareto-development-tools/test';

console.log('Running all tests...\n');
console.log('='.repeat(60));

let failed_tests = 0;
let passed_tests = 0;

// Test 1: DOT file generation
console.log('\n1. Testing DOT file generation...');
try {
    execSync('node ./dist/bin/test_dot_file_generation.js', {
        cwd: test_base_dir,
        stdio: 'inherit'
    });
    console.log('✓ DOT file generation test passed');
    passed_tests++;
} catch (err) {
    console.error('✗ DOT file generation test failed');
    failed_tests++;
}

// Test 2: SVG generation
console.log('\n2. Testing SVG generation...');
try {
    execSync('node ./dist/bin/test_svg_generation.js', {
        cwd: test_base_dir,
        stdio: 'inherit'
    });
    console.log('✓ SVG generation test passed');
    passed_tests++;
} catch (err) {
    console.error('✗ SVG generation test failed');
    failed_tests++;
}

// Test 3: HTML generation
console.log('\n3. Testing HTML generation...');
try {
    execSync('node ./dist/bin/test_html_generation.js', {
        cwd: test_base_dir,
        stdio: 'inherit'
    });
    console.log('✓ HTML generation test passed');
    passed_tests++;
} catch (err) {
    console.error('✗ HTML generation test failed');
    failed_tests++;
}

// Summary
console.log('\n' + '='.repeat(60));
console.log(`Test Summary:`);
console.log(`  - ${passed_tests} test(s) passed`);
console.log(`  - ${failed_tests} test(s) failed`);

if (failed_tests > 0) {
    console.log('\n❌ Some tests failed');
    process.exit(1);
} else {
    console.log('\n✓ All tests passed');
}
