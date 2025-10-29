#!/usr/bin/env node
const fs = require('fs');
const path = require('path');
const { build_project, is_node_project } = require('../lib/build_test_utils');

// Parse command line arguments
const args = process.argv.slice(2);
const flags = args.filter(arg => arg.startsWith('-'));
const package_dir = args.find(arg => !arg.startsWith('-'));

// Parse flags
const help = flags.includes('-h') || flags.includes('--help');

// Show help
if (help || !package_dir) {
    console.log('Usage: pareto build <package-directory>');
    console.log('');
    console.log('Build a single Node.js/TypeScript project.');
    console.log('Shows all build output including errors (does not suppress anything).');
    console.log('');
    console.log('Options:');
    console.log('  -h, --help       Show this help message');
    console.log('');
    console.log('Examples:');
    console.log('  build.js ../my-package');
    console.log('  build.js ../pareto-repositories/my-repo');
    
    if (!package_dir) {
        process.exit(1);
    } else {
        process.exit(0);
    }
}

const package_path = path.resolve(package_dir);

// Check if directory exists
if (!fs.existsSync(package_path)) {
    console.error(`Error: Directory ${package_path} does not exist`);
    process.exit(1);
}

// Check if it's a Node.js project
if (!is_node_project(package_path)) {
    console.error(`Error: ${package_path} is not a Node.js project (no package.json found in pub/ subdirectory)`);
    process.exit(1);
}

const package_name = path.basename(package_path);

console.log(`Building project: ${package_name}`);
console.log(`Project path: ${package_path}`);
console.log('');

try {
    // Build with verbose output and errors not suppressed
    const build_succeeded = build_project(package_path, { 
        verbose: true,  // Show all build output
        throw_on_error: false  // Don't throw, but return false on failure
    });
    
    if (build_succeeded) {
        console.log(`\n✅ Successfully built ${package_name}!`);
        process.exit(0);
    } else {
        console.error(`\n❌ Build failed for ${package_name}`);
        process.exit(1);
    }
} catch (err) {
    console.error(`\n❌ Unexpected error building ${package_name}:`);
    console.error(err.message);
    process.exit(1);
}