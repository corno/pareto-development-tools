#!/usr/bin/env node
const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');
const { is_node_project } = require('../lib/build_test_utils');
const { $$ } = require('../lib/build_and_test');
// Get package directory and flags from command line arguments
const args = process.argv.slice(2);
const package_dir = args.find(arg => !arg.startsWith('-'));
const should_clean = args.includes('-c') || args.includes('--clean');
const is_verbose = args.includes('-v') || args.includes('--verbose');
if (!package_dir) {
    console.error('Usage: pareto test <package-directory> [-c|--clean] [-v|--verbose]');
    console.error('  -c, --clean      Clean dist and node_modules before building');
    console.error('  -v, --verbose    Show detailed output');
    process.exit(1);
}
const package_path = path.resolve(package_dir);
// Check if it's a valid Node.js project
if (!is_node_project(package_path)) {
    console.error(`Error: package.json not found in ${package_path}`);
    process.exit(1);
}
const package_name = path.basename(package_path);
console.log(`Testing package: ${package_name}`);
console.log(`Package path: ${package_path}`);
if (should_clean) {
    console.log('🧹 Clean mode: Will remove dist and node_modules before building');
}
async function main() {
    try {
        let step_number = 1;
        // Step 1: Clean (optional)
        if (should_clean) {
            console.log(`\n${step_number++}. Cleaning...`);
            const dist_dir = path.join(package_path, 'pub', 'dist');
            if (fs.existsSync(dist_dir)) {
                fs.rmSync(dist_dir, { recursive: true, force: true });
                console.log('✓ Removed dist directory');
            }
            const node_modules_dir = path.join(package_path, 'pub', 'node_modules');
            if (fs.existsSync(node_modules_dir)) {
                fs.rmSync(node_modules_dir, { recursive: true, force: true });
                console.log('✓ Removed node_modules directory');
                // Install dependencies after cleaning node_modules
                console.log('📦 Installing dependencies...');
                execSync('npm install', {
                    cwd: path.join(package_path, 'pub'),
                    stdio: is_verbose ? 'inherit' : 'pipe'
                });
                console.log('✓ Dependencies installed');
            }
        }
        // Step 2: Build and Test
        console.log(`\n${step_number++}. Building and testing...`);
        const result = $$(package_path, {
            verbose: is_verbose,
            throw_on_error: false
        });
        if (result[0] === 'failure') {
            throw new Error(result[1].reason[1].details);
        }
        console.log('✓ Build completed');
        console.log('✓ Tests passed');
        console.log(`\n🎉 Successfully tested ${package_name}!`);
    }
    catch (err) {
        console.error(`\n❌ Failed to test ${package_name}:`);
        console.error(err.message);
        process.exit(1);
    }
}
main();
