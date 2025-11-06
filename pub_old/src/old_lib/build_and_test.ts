import { execSync } from 'child_process'
import * as fs from 'fs'
import * as path from 'path'

export type Status =
    | ['success', null]
    | ['failure', {
        reason:
        | ['build failing', { details: string }]
        | ['tests failing', { details: string }]
    }]

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
        console.log(`tsc --project ${project_path}/pub`)
        execSync(`tsc --project ${project_path}/pub`, {
            cwd: project_path,
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

/**
 * Run tests for a project
 */
function test_project(project_path: string, options: { verbose?: boolean, throw_on_error?: boolean, test_file?: string } = {}): boolean {
    const { verbose = false, throw_on_error = false, test_file } = options;
    
    // If no test_file is specified, skip testing
    if (!test_file) {
        if (verbose) {
            console.log('No test file specified, skipping tests');
        }
        return true; // Return success when tests are intentionally skipped
    }
    
    const full_test_path = path.join(project_path, test_file);
    
    if (!fs.existsSync(full_test_path)) {
        if (verbose) {
            console.log(`Test file not found: ${test_file}, skipping tests`);
        }
        return true; // Return success when test file doesn't exist (tests are optional)
    }
    
    try {
        if (verbose) {
            console.log(`Running tests from ${test_file}...`);
        }
        execSync(`node --enable-source-maps ${test_file}`, {
            cwd: project_path,
            stdio: verbose ? 'inherit' : 'pipe'
        });
        return true;
    } catch (err: any) {
        if (throw_on_error) {
            throw err;
        }
        return false;
    }
}


export const $$ = (
    project_path: string,
    options: {
        'verbose'?: boolean,
        'skip_tests'?: boolean
    }
): Status => {
    const verbose = options.verbose || false;
    const skip_tests = options.skip_tests || false;

    const errors: string[] = [];

    try {
        // Build
        const build_success = build_project(project_path, { verbose, throw_on_error: false });
        if (!build_success) {
            errors.push('Build failed');
            return ['failure', {
                reason: ['build failing', {
                    details: errors.join('\n')
                }]
            }];
        }

        // Test (only if build succeeded and tests are not skipped)
        if (!skip_tests) {
            const test_success = test_project(project_path, { 
                verbose, 
                throw_on_error: false,
                test_file: './test/dist/bin/test.js'
            });
            if (!test_success) {
                errors.push('Tests failed');
                return ['failure', {
                    reason: ['tests failing', {
                        details: errors.join('\n')
                    }]
                }];
            }
        }

        return ['success', null];

    } catch (err: any) {
        return ['failure', {
            reason: ['build failing', {
                details: err.message || 'Unknown error'
            }]
        }];
    }
}