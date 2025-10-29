const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');
const os = require('os');
const { build_project } = require('./build_test_utils');
/**
 * Extract a local package to a target directory
 * @param {string} sourcePath - Path to the local package directory
 * @param {string} targetPath - Path where the extracted package should be placed
 * @param {object} options - Extraction options
 * @param {boolean} options.verbose - Show detailed output
 * @param {boolean} options.skipBuild - Skip building the local package
 * @returns {object} - Result object with extraction status
 */
function extract_local(source_path, target_path, options = {}) {
    const { verbose = false, skip_build = false } = options;
    const result = {
        success: false,
        error: null,
        package_name: null,
        build_failed: false
    };
    try {
        // Read package.json to get package name
        const package_json_path = path.join(source_path, 'pub', 'package.json');
        if (!fs.existsSync(package_json_path)) {
            throw new Error(`package.json not found in ${source_path}/pub`);
        }
        const package_json = JSON.parse(fs.readFileSync(package_json_path, 'utf8'));
        const package_name = package_json.name;
        if (!package_name) {
            throw new Error('package.json must have a "name" field');
        }
        result.package_name = package_name;
        // Build local package if needed
        let build_failed = false;
        if (!skip_build) {
            if (verbose) {
                console.log(`Building local package ${package_name}...`);
            }
            try {
                build_project(source_path, {
                    verbose: verbose,
                    throw_on_error: true
                });
                if (verbose) {
                    console.log('✓ Local package built');
                }
            }
            catch (err) {
                build_failed = true;
                if (verbose) {
                    console.log(`⚠️ Build failed for ${package_name}: ${err.message}`);
                    console.log('Creating _BUILD_FAILED placeholder...');
                }
            }
        }
        else if (verbose) {
            console.log('Skipping build (using existing dist)...');
        }
        // Create target directory
        if (!fs.existsSync(target_path)) {
            fs.mkdirSync(target_path, { recursive: true });
        }
        if (build_failed) {
            // Create a _BUILD_FAILED file instead of packaging
            if (verbose) {
                console.log(`Creating _BUILD_FAILED placeholder in ${target_path}...`);
            }
            fs.writeFileSync(path.join(target_path, '_BUILD_FAILED'), `Build failed for package: ${package_name}\n` +
                `Source path: ${source_path}\n` +
                `Timestamp: ${new Date().toISOString()}\n\n` +
                `This placeholder was created because the build failed.\n` +
                `The published package can still be compared to see what should be built.`);
            result.success = true; // Still consider it successful for comparison purposes
            result.build_failed = true;
            if (verbose) {
                console.log('✓ _BUILD_FAILED placeholder created');
            }
            return result;
        }
        if (verbose) {
            console.log(`Creating local package in ${target_path}...`);
        }
        // Create package using npm pack
        execSync(`npm pack "${path.join(source_path, 'pub')}"`, {
            cwd: target_path,
            stdio: 'pipe'
        });
        // Find and extract the .tgz file
        const tgz_files = fs.readdirSync(target_path).filter(file => file.endsWith('.tgz'));
        if (tgz_files.length === 0) {
            throw new Error('No .tgz file found after npm pack');
        }
        const tgz_file = tgz_files[0];
        execSync(`tar -xzf "${tgz_file}"`, {
            cwd: target_path,
            stdio: 'pipe'
        });
        // Move contents from package/ subdirectory to target_path
        const package_sub_dir = path.join(target_path, 'package');
        if (fs.existsSync(package_sub_dir)) {
            const files = fs.readdirSync(package_sub_dir);
            files.forEach(file => {
                const source_file_path = path.join(package_sub_dir, file);
                const dest_path = path.join(target_path, file);
                // Remove destination if it exists
                if (fs.existsSync(dest_path)) {
                    fs.rmSync(dest_path, { recursive: true, force: true });
                }
                fs.renameSync(source_file_path, dest_path);
            });
            fs.rmSync(package_sub_dir, { recursive: true });
        }
        // Remove the .tgz file
        fs.unlinkSync(path.join(target_path, tgz_file));
        result.success = true;
        if (verbose) {
            console.log('✓ Local package extracted');
        }
        return result;
    }
    catch (err) {
        result.error = err.message;
        return result;
    }
}
/**
 * Extract a published package from npm to a target directory
 * @param {string} package_name - Name of the package to download from npm
 * @param {string} target_path - Path where the extracted package should be placed
 * @param {object} options - Extraction options
 * @param {boolean} options.verbose - Show detailed output
 * @returns {object} - Result object with extraction status
 */
function extract_published(package_name, target_path, options = {}) {
    const { verbose = false } = options;
    const result = {
        success: false,
        error: null,
        package_exists: false
    };
    try {
        // Create target directory
        if (!fs.existsSync(target_path)) {
            fs.mkdirSync(target_path, { recursive: true });
        }
        if (verbose) {
            console.log(`Downloading published package ${package_name}...`);
        }
        try {
            execSync(`npm pack ${package_name}`, {
                cwd: target_path,
                stdio: 'pipe'
            });
            result.package_exists = true;
            // Find the .tgz file and extract it
            const tgz_files = fs.readdirSync(target_path).filter(file => file.endsWith('.tgz'));
            if (tgz_files.length === 0) {
                throw new Error('No .tgz file found after npm pack');
            }
            const tgz_file = tgz_files[0];
            // Extract the package
            execSync(`tar -xzf "${tgz_file}"`, {
                cwd: target_path,
                stdio: 'pipe'
            });
            // Move contents from package/ subdirectory to target_path
            const package_sub_dir = path.join(target_path, 'package');
            if (fs.existsSync(package_sub_dir)) {
                const files = fs.readdirSync(package_sub_dir);
                files.forEach(file => {
                    const source_file_path = path.join(package_sub_dir, file);
                    const dest_path = path.join(target_path, file);
                    // Remove destination if it exists
                    if (fs.existsSync(dest_path)) {
                        fs.rmSync(dest_path, { recursive: true, force: true });
                    }
                    fs.renameSync(source_file_path, dest_path);
                });
                fs.rmSync(package_sub_dir, { recursive: true });
            }
            // Remove the .tgz file
            fs.unlinkSync(path.join(target_path, tgz_file));
            result.success = true;
            if (verbose) {
                console.log('✓ Published package extracted');
            }
        }
        catch (err) {
            if (err.message.includes('404') || err.message.includes('Not Found')) {
                result.error = `Package "${package_name}" not found on npm registry`;
                return result;
            }
            throw err;
        }
        return result;
    }
    catch (err) {
        result.error = err.message;
        return result;
    }
}
/**
 * Compare two directories to check if they are equal
 * @param {string} dir1 - First directory to compare
 * @param {string} dir2 - Second directory to compare
 * @param {object} options - Comparison options
 * @param {boolean} options.verbose - Show detailed output
 * @returns {object} - Result object with comparison status
 */
function compare_directories(dir1, dir2, options = {}) {
    const { verbose = false } = options;
    const result = {
        identical: false,
        error: null
    };
    try {
        if (!fs.existsSync(dir1)) {
            throw new Error(`Directory does not exist: ${dir1}`);
        }
        if (!fs.existsSync(dir2)) {
            throw new Error(`Directory does not exist: ${dir2}`);
        }
        if (verbose) {
            console.log(`Comparing directories: ${dir1} vs ${dir2}`);
        }
        try {
            execSync(`diff -r "${dir1}" "${dir2}"`, {
                stdio: 'pipe'
            });
            result.identical = true;
            if (verbose) {
                console.log('✓ Directories are identical');
            }
        }
        catch (err) {
            result.identical = false;
            if (verbose) {
                console.log('📊 Directories differ');
            }
        }
        return result;
    }
    catch (err) {
        result.error = err.message;
        return result;
    }
}
/**
 * Launch Beyond Compare to compare two directories
 * @param {string} dir1 - First directory to compare
 * @param {string} dir2 - Second directory to compare
 * @param {object} options - Comparison options
 * @param {boolean} options.verbose - Show detailed output
 * @returns {object} - Result object with launch status
 */
function launch_beyond_compare(dir1, dir2, options = {}) {
    const { verbose = false } = options;
    const result = {
        launched: false,
        error: null
    };
    try {
        if (!fs.existsSync(dir1)) {
            throw new Error(`Directory does not exist: ${dir1}`);
        }
        if (!fs.existsSync(dir2)) {
            throw new Error(`Directory does not exist: ${dir2}`);
        }
        if (verbose) {
            console.log('Launching Beyond Compare...');
        }
        try {
            execSync(`bcompare -fv "${dir1}" "${dir2}"`, {
                stdio: 'inherit'
            });
            result.launched = true;
            if (verbose) {
                console.log('✓ Beyond Compare session completed');
            }
        }
        catch (bc_err) {
            if (verbose) {
                console.warn('Could not launch Beyond Compare');
            }
            result.error = 'Could not launch Beyond Compare: ' + bc_err.message;
        }
        return result;
    }
    catch (err) {
        result.error = err.message;
        return result;
    }
}
/**
 * Launch Beyond Compare if two directories are not equal
 * @param {string} dir1 - First directory to compare
 * @param {string} dir2 - Second directory to compare
 * @param {object} options - Comparison options
 * @param {boolean} options.verbose - Show detailed output
 * @returns {object} - Result object with comparison status
 */
function launch_beyond_compare_if_directories_are_not_equal(dir1, dir2, options = {}) {
    const { verbose = false } = options;
    const result = {
        identical: false,
        beyond_compare_launched: false,
        error: null
    };
    try {
        // First compare
        const compare_result = compare_directories(dir1, dir2, { verbose });
        result.identical = compare_result.identical;
        if (compare_result.error) {
            result.error = compare_result.error;
            return result;
        }
        // Launch Beyond Compare if not identical
        if (!result.identical) {
            const launch_result = launch_beyond_compare(dir1, dir2, { verbose });
            result.beyond_compare_launched = launch_result.launched;
            if (launch_result.error) {
                result.error = launch_result.error;
            }
        }
        return result;
    }
    catch (err) {
        result.error = err.message;
        return result;
    }
}
module.exports = {
    extract_local,
    extract_published,
    compare_directories,
    launch_beyond_compare,
    launch_beyond_compare_if_directories_are_not_equal
};
