#!/usr/bin/env node
import * as fs from 'fs';
import * as path from 'path';
import { clean_project } from '../old_lib/clean_project';
import { is_node_project } from '../old_lib/is_node_project';

function main(): void {
    // Parse command line arguments
    const args = process.argv.slice(2);
    const flags = args.filter(arg => arg.startsWith('-'));
    const package_dir = args.find(arg => !arg.startsWith('-'));

    // Parse flags
    const verbose = flags.includes('-v') || flags.includes('--verbose');
    const dist_only = flags.includes('-d') || flags.includes('--dist-only');
    const node_modules_only = flags.includes('-n') || flags.includes('--node-modules-only');
    const git_clean = flags.includes('-g') || flags.includes('--git');
    const help = flags.includes('-h') || flags.includes('--help');

    // Show help
    if (help || !package_dir) {
        console.log('Usage: pareto clean <package-directory> [options]');
        console.log('');
        console.log('Clean a single Node.js project by removing dist and node_modules directories');
        console.log('');
        console.log('Options:');
        console.log('  -v, --verbose          Show verbose output');
        console.log('  -d, --dist-only        Only clean dist directory');
        console.log('  -n, --node-modules-only Only clean node_modules directory');
        console.log('  -g, --git              Clean everything listed in .gitignore');
        console.log('  -h, --help             Show this help message');
        console.log('');
        console.log('Examples:');
        console.log('  clean.js ../my-package');
        console.log('  clean.js ../my-package --verbose');
        console.log('  clean.js ../my-package --dist-only');
        console.log('  clean.js ../my-package --node-modules-only');
        console.log('  clean.js ../my-package --git');
        
        if (!package_dir) {
            process.exit(1);
        } else {
            process.exit(0);
        }
    }

    const package_path = path.resolve(package_dir);

    try {
        // Check if directory exists
        if (!fs.existsSync(package_path)) {
            console.error(`Error: Directory ${package_path} does not exist`);
            process.exit(1);
        }

        // Check if it's a Node.js project
        if (!is_node_project(package_path)) {
            console.error(`Error: ${package_path} is not a Node.js project (no package.json found)`);
            process.exit(1);
        }

        // Validate conflicting flags
        const flag_count = [dist_only, node_modules_only, git_clean].filter(Boolean).length;
        if (flag_count > 1) {
            console.error('Error: Cannot use --dist-only, --node-modules-only, and --git together');
            process.exit(1);
        }

        console.log(`Cleaning project: ${path.basename(package_path)}`);
        if (verbose) {
            console.log(`Project path: ${package_path}`);
            if (dist_only) {
                console.log('Mode: Cleaning dist directory only');
            } else if (node_modules_only) {
                console.log('Mode: Cleaning node_modules directory only');
            } else if (git_clean) {
                console.log('Mode: Cleaning everything in .gitignore');
            } else {
                console.log('Mode: Cleaning both dist and node_modules directories');
            }
        }

        // Perform the cleaning (this now throws on error)
        clean_project(package_path, {
            verbose,
            dist_only,
            node_modules_only,
            use_git: git_clean
        });

        // If we get here, cleaning was successful
        console.log('✓ Cleaning completed successfully');

    } catch (err: any) {
        console.error(`❌ Cleaning failed: ${err.message}`);
        process.exit(1);
    }
}

main();