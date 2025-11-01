const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

/**
 * Make files in the bin directories executable
 * @param {string} project_path - Path to the project directory
 * @param {boolean} verbose - Show detailed output
 */
function make_bin_executable(project_path, verbose = false) {
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
                    } catch (chmodErr) {
                        console.warn(`Warning: Could not make ${file} executable:`, chmodErr.message);
                    }
                }
            });
            
            const js_files = files.filter(file => file.endsWith('.js'));
            if (verbose && js_files.length > 0) {
                const relative_path = path.relative(project_path, bin_dir);
                console.log(`✓ Made ${js_files.length} JavaScript file(s) in ${relative_path} directory executable`);
            }
        } catch (err) {
            const relative_path = path.relative(project_path, bin_dir);
            console.warn(`Warning: Could not process ${relative_path} directory:`, err.message);
        }
    });
}

/**
 * Build a TypeScript project using tsc
 * @param {string} project_path - Path to the project directory
 * @param {object} options - Build options
 * @param {boolean} options.verbose - Show detailed output
 * @param {boolean} options.throw_on_error - Throw error instead of returning false
 * @returns {boolean} - True if build succeeded, false if failed (when throw_on_error is false)
 */
function build_project(project_path, options = {}) {
    const { verbose = false, throw_on_error = true } = options;
    
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
    } catch (err) {
        if (throw_on_error) {
            throw err;
        }
        return false;
    }
}

/**
 * Run tests for a project
 * @param {string} project_path - Path to the project directory
 * @param {object} options - Test options
 * @param {boolean} options.verbose - Show detailed output
 * @param {boolean} options.throw_on_error - Throw error instead of returning false
 * @param {string} options.test_file - Custom test file path (relative to project directory)
 * @returns {boolean} - True if tests passed, false if failed (when throw_on_error is false)
 */
function test_project(project_path, options = {}) {
    
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
    } catch (err) {
        if (throw_on_error) {
            throw err;
        }
        return false;
    }
}

/**
 * Check if a directory contains a valid Node.js/TypeScript project
 * @param {string} project_path - Path to check
 * @returns {boolean} - True if directory contains package.json in pub subdirectory
 */
function is_node_project(project_path) {
    return fs.existsSync(path.join(project_path, 'pub', 'package.json'));
}

module.exports = {
    build_project,
    test_project,
    is_node_project,
    make_bin_executable
};