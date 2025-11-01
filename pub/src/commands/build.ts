#!/usr/bin/env node
/**
 * Package Build Command
 * 
 * Builds a single package repository using TypeScript compilation.
 * 
 * Usage: pareto build <repository-root-directory>
 * 
 * The directory should be the repository root containing a pub/ subdirectory.
 * Expected structure:
 *   <repository-root>/
 *   ├── pub/
 *   │   ├── package.json
 *   │   ├── tsconfig.json
 *   │   └── src/
 *   └── test/ (optional)
 *       ├── package.json (optional)
 *       ├── tsconfig.json (optional)
 *       └── src/
 * 
 * Example: pareto build /path/to/my-package-repo
 * This will build /path/to/my-package-repo/pub/ and optionally /path/to/my-package-repo/test/
 */

import * as fs from 'fs'
import * as path from 'path'
import { is_node_project } from '../old_lib/is_node_project'

// We need to extract the build_project function since it's not exported
import { execSync } from 'child_process'

/**
 * Make files in the bin directories executable
 */
function make_bin_executable(project_path: string, verbose: boolean = false): void {
    const bin_dirs = [
        path.join(project_path, 'pub', 'dist', 'bin'),
        path.join(project_path, 'test', 'dist', 'bin')
    ];
    
    bin_dirs.forEach(bin_dir => {
        if (!fs.existsSync(bin_dir)) {
            if (verbose) {
                const relative_path = path.relative(project_path, bin_dir);
                console.log(`No ${relative_path} directory found, skipping executable setup for that directory`);
            }
            return;
        }
        
        try {
            const files = fs.readdirSync(bin_dir);
            if (files.length === 0) {
                if (verbose) {
                    const relative_path = path.relative(project_path, bin_dir);
                    console.log(`No files in ${relative_path} directory`);
                }
                return;
            }
            
            files.forEach(file => {
                const file_path = path.join(bin_dir, file);
                const stats = fs.statSync(file_path);
                
                if (stats.isFile() && file.endsWith('.js')) {
                    try {
                        // Make file executable (add execute permission for owner, group, and others)
                        fs.chmodSync(file_path, stats.mode | 0o111);
                        if (verbose) {
                            console.log(`Made executable: ${path.relative(project_path, file_path)}`);
                        }
                    } catch (chmodErr: any) {
                        console.warn(`Warning: Could not make ${file} executable:`, chmodErr.message);
                    }
                }
            });
            
            const js_files = files.filter(file => file.endsWith('.js'));
            if (verbose && js_files.length > 0) {
                const relative_path = path.relative(project_path, bin_dir);
                console.log(`✓ Made ${js_files.length} JavaScript file(s) in ${relative_path} directory executable`);
            }
        } catch (err: any) {
            const relative_path = path.relative(project_path, bin_dir);
            console.warn(`Warning: Could not process ${relative_path} directory:`, err.message);
        }
    });
}

/**
 * Build a TypeScript project using tsc
 */
function build_project(project_path: string, options: { verbose?: boolean, throw_on_error?: boolean } = {}): boolean {
    const { verbose = false, throw_on_error = false } = options;
    
    try {
        // Build the main project (pub directory)
        if (verbose) {
            console.log('Building pub directory...');
        }
        execSync(`tsc --project ${path.join(project_path, 'pub')}`, {
            stdio: verbose ? 'inherit' : 'pipe'
        });
        
        // Build the test directory if it exists and has a tsconfig.json
        const test_tsconfig = path.join(project_path, 'test', 'tsconfig.json');
        const test_package_json = path.join(project_path, 'test', 'package.json');
        if (fs.existsSync(test_tsconfig)) {
            // Install test dependencies if package.json exists and node_modules doesn't exist
            if (fs.existsSync(test_package_json)) {
                const test_node_modules = path.join(project_path, 'test', 'node_modules');
                if (!fs.existsSync(test_node_modules)) {
                    if (verbose) {
                        console.log('Installing test dependencies...');
                    }
                    execSync('npm install', {
                        cwd: path.join(project_path, 'test'),
                        stdio: verbose ? 'inherit' : 'pipe'
                    });
                }
            }
            
            if (verbose) {
                console.log('Building test directory...');
            }
            execSync(`tsc --project ${path.join(project_path, 'test')}`, {
                stdio: verbose ? 'inherit' : 'pipe'
            });
        } else if (verbose) {
            console.log('No test tsconfig.json found, skipping test build');
        }
        
        // After successful build, make bin files executable
        make_bin_executable(project_path, verbose);
        
        return true;
    } catch (err: any) {
        if (throw_on_error) {
            throw err;
        }
        return false;
    }
}

function showHelp(): void {
    console.log(`
Package Build Tool

Usage: 
  pareto build [options] [package-root-directory]

Options:
  --help                Show this help message
  --verbose             Show detailed build output
  --quiet               Suppress all output except errors

Arguments:
  package-root-directory   Path to package root (defaults to current directory)
                          Expected structure: <path>/pub/package.json

Examples:
  pareto build                     # Build current directory
  pareto build /path/to/package    # Build specific package
  pareto build --verbose           # Build with detailed output
  pareto build --quiet             # Build silently
`)
}

export const $$ = (): void => {
    // Parse command line arguments
    const args = process.argv.slice(2)
    
    // Check for help flag
    if (args.includes('--help') || args.includes('-h')) {
        showHelp()
        process.exit(0)
    }
    
    // Parse flags
    const verbose = args.includes('--verbose')
    const quiet = args.includes('--quiet')
    
    // Get package directory (non-flag arguments)
    const non_flag_args = args.filter(arg => !arg.startsWith('--'))
    const package_dir = non_flag_args.length > 0 ? path.resolve(non_flag_args[0]) : process.cwd()
    
    // Check if this is a valid package structure (has pub/package.json)
    const package_json_path = path.join(package_dir, 'pub', 'package.json')
    if (!fs.existsSync(package_json_path)) {
        console.error(`Error: No pub/package.json found in directory: ${package_dir}`)
        console.error('Please specify the package root directory (parent of pub/), not the pub/ directory itself.')
        console.error('Expected structure: <your-path>/pub/package.json')
        process.exit(1)
    }
    
    if (!is_node_project(package_dir)) {
        console.error(`Error: ${package_dir} is not a Node.js project (no package.json found in pub/ subdirectory)`)
        process.exit(1)
    }
    
    const package_name = path.basename(package_dir)
    
    if (!quiet) {
        console.log(`Building project: ${package_name}`)
        console.log(`Project path: ${package_dir}`)
        if (verbose) {
            console.log('Build mode: verbose')
        }
        console.log('')
    }
    
    try {
        // Build with verbose output and errors not suppressed
        const build_succeeded = build_project(package_dir, { 
            verbose: verbose || !quiet,  // Show output if verbose or not quiet
            throw_on_error: false  // Don't throw, but return false on failure
        })
        
        if (build_succeeded) {
            if (!quiet) {
                console.log(`\n✅ Successfully built ${package_name}!`)
            }
            process.exit(0)
        } else {
            console.error(`\n❌ Build failed for ${package_name}`)
            process.exit(1)
        }
    } catch (err: any) {
        console.error(`\n❌ Unexpected error building ${package_name}:`)
        console.error(err.message)
        process.exit(1)
    }
}

// Run if called directly
if (require.main === module) {
    $$()
}