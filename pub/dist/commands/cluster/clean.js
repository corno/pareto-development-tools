#!/usr/bin/env node
const fs = require('fs');
const path = require('path');
const { clean_project, is_node_project } = require('../../lib/clean_utils');
// Parse command line arguments
const args = process.argv.slice(2);
const flags = args.filter(arg => arg.startsWith('-'));
const target_dir = args.find(arg => !arg.startsWith('-'));
// Parse flags
const verbose = flags.includes('-v') || flags.includes('--verbose');
const use_git = flags.includes('-g') || flags.includes('--git');
const help = flags.includes('-h') || flags.includes('--help');
// Show help
if (help || !target_dir) {
    console.log('Usage: pareto all clean <directory> [options]');
    console.log('');
    console.log('Clean all Node.js projects in a directory');
    console.log('');
    console.log('Options:');
    console.log('  -v, --verbose    Show verbose output');
    console.log('  -g, --git        Use git clean (removes .gitignore files) instead of manual cleaning');
    console.log('  -h, --help       Show this help message');
    console.log('');
    console.log('Examples:');
    console.log('  clean_all.js ../my-repos');
    console.log('  clean_all.js ../my-repos --verbose');
    console.log('  clean_all.js ../my-repos --git');
    if (!target_dir) {
        process.exit(1);
    }
    else {
        process.exit(0);
    }
}
const base_dir = path.resolve(target_dir);
if (!fs.existsSync(base_dir)) {
    console.error(`Error: Directory ${target_dir} does not exist`);
    process.exit(1);
}
console.log(`Cleaning all projects in ${target_dir}...`);
if (use_git) {
    console.log('Using git clean mode (removes .gitignore files)');
}
else {
    console.log('Using manual clean mode (removes dist and node_modules)');
}
let total_projects = 0;
let successful_cleans = 0;
let failed_cleans = 0;
fs.readdirSync(base_dir, { withFileTypes: true })
    .filter(dirent => dirent.isDirectory())
    .forEach(dirent => {
    const dir_path = path.join(base_dir, dirent.name);
    if (is_node_project(dir_path)) {
        total_projects++;
        const result = clean_project(dir_path, { verbose, use_git });
        if (result.success) {
            successful_cleans++;
        }
        else {
            failed_cleans++;
        }
    }
});
console.log(`\nCleaning completed:`);
console.log(`  - ${total_projects} projects processed`);
console.log(`  - ${successful_cleans} cleaned successfully`);
if (failed_cleans > 0) {
    console.log(`  - ${failed_cleans} failed to clean`);
}
