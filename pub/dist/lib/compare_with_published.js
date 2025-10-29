"use strict";
/**
 * Compare With Published Function
 *
 * Compares the local package with the published version on npm.
 *
 * WORKFLOW:
 * =========
 * 1. Extract local package
 * 2. Extract published package (if exists)
 * 3. Compare directories
 * 4. Return comparison result
 *
 * @param {string} package_path - Path to the package directory
 * @param {function} prompt_user - Callback to prompt user for input
 * @param {object} options - Options { verbose?, launch_beyond_compare? }
 * @returns {Status} - Status tuple indicating result
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.$$ = void 0;
const fs = require('fs');
const path = require('path');
const { extract_local, extract_published, compare_directories, launch_beyond_compare } = require('./package_compare_utils');
const $$ = async (package_path, prompt_user, options = {}) => {
    const package_json_path = path.join(package_path, 'pub', 'package.json');
    const package_json = JSON.parse(fs.readFileSync(package_json_path, 'utf8'));
    const package_name = package_json.name;
    // Create temp directory for comparison
    const temp_dir = path.join(package_path, '.tmp_comparison');
    const local_extract_dir = path.join(temp_dir, 'local');
    const published_extract_dir = path.join(temp_dir, 'published');
    if (fs.existsSync(temp_dir)) {
        fs.rmSync(temp_dir, { recursive: true, force: true });
    }
    try {
        // Extract local package
        const local_result = extract_local(package_path, local_extract_dir, { verbose: false, skip_build: true });
        if (!local_result.success) {
            return ['error', { details: `Failed to extract local package: ${local_result.error}` }];
        }
        // Try to extract published package
        const published_result = extract_published(package_name, published_extract_dir, { verbose: false });
        if (published_result.success) {
            // Compare the two directories
            const compare_result = compare_directories(local_extract_dir, published_extract_dir, { verbose: false });
            if (compare_result.identical) {
                const really_publish = await prompt_user('⚠️  No changes detected. Do you really want to publish? (y/n): ');
                if (really_publish.toLowerCase() !== 'y' && really_publish.toLowerCase() !== 'yes') {
                    return ['cancelled', null];
                }
                return ['continue', { message: 'No changes detected, but continuing anyway' }];
            }
            else {
                // Changes detected
                if (options.launch_beyond_compare) {
                    const want_compare = await prompt_user('Changes detected. Do you want to compare using Beyond Compare? (y/n): ');
                    if (want_compare.toLowerCase() === 'y' || want_compare.toLowerCase() === 'yes') {
                        const launch_result = launch_beyond_compare(local_extract_dir, published_extract_dir, { verbose: false });
                        if (!launch_result.launched) {
                            console.warn('⚠️  Beyond Compare not available:', launch_result.error);
                        }
                        const proceed = await prompt_user('Do you want to proceed with publishing? (y/n): ');
                        if (proceed.toLowerCase() !== 'y' && proceed.toLowerCase() !== 'yes') {
                            return ['cancelled', null];
                        }
                    }
                }
                return ['continue', { message: 'Changes detected' }];
            }
        }
        else if (!published_result.package_exists) {
            return ['continue', { message: 'No published version found (first publish)' }];
        }
        else {
            return ['error', { details: `Failed to extract published package: ${published_result.error}` }];
        }
    }
    finally {
        // Clean up temp directory
        if (fs.existsSync(temp_dir)) {
            fs.rmSync(temp_dir, { recursive: true, force: true });
        }
    }
};
exports.$$ = $$;
