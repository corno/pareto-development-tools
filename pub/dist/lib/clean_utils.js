const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');
/**
 * Clean using git clean -fdX (removes all ignored files)
 * @param {string} project_path - Path to the project directory
 * @param {object} options - Cleaning options
 * @param {boolean} options.verbose - Whether to show verbose output
 * @returns {object} - Object containing success status and results
 */
function git_clean_project(project_path, options = {}) {
    const { verbose = false } = options;
    const project_name = path.basename(project_path);
    const errors = [];
    if (verbose) {
        console.log(`Git cleaning ${project_name}...`);
    }
    // Check if .gitignore exists
    const gitignore_path = path.join(project_path, '.gitignore');
    if (!fs.existsSync(gitignore_path)) {
        const error_msg = `No .gitignore file found in ${project_name}`;
        errors.push(error_msg);
        if (verbose) {
            console.warn(`⚠ ${error_msg}`);
        }
        return {
            success: false,
            cleaned: [],
            errors,
            project_name
        };
    }
    // Check if git is available
    try {
        execSync('git --version', { stdio: 'pipe' });
    }
    catch (err) {
        const error_msg = `Git command not found for ${project_name}`;
        errors.push(error_msg);
        console.error(error_msg);
        return {
            success: false,
            cleaned: [],
            errors,
            project_name
        };
    }
    // Check if directory is a git repository
    try {
        execSync('git rev-parse --git-dir', { cwd: project_path, stdio: 'pipe' });
    }
    catch (err) {
        const error_msg = `${project_name} is not a git repository`;
        errors.push(error_msg);
        if (verbose) {
            console.warn(`⚠ ${error_msg}`);
        }
        return {
            success: false,
            cleaned: [],
            errors,
            project_name
        };
    }
    try {
        // Use git clean to remove ignored files
        // -f: force removal
        // -d: remove directories
        // -X: remove only ignored files (not untracked files)
        const git_clean_cmd = 'git clean -fdX';
        if (verbose) {
            console.log(`Running: ${git_clean_cmd}`);
            execSync(git_clean_cmd, { cwd: project_path, stdio: 'inherit' });
            console.log('✓ Git clean completed');
        }
        else {
            const output = execSync(git_clean_cmd, { cwd: project_path, encoding: 'utf8' });
            if (output.trim()) {
                if (verbose) {
                    console.log('✓ Removed ignored files and directories');
                    console.log(output);
                }
            }
            else {
                if (verbose) {
                    console.log('✓ No ignored files to clean');
                }
            }
        }
        return {
            success: true,
            cleaned: ['git-ignored-files'],
            errors: [],
            project_name
        };
    }
    catch (err) {
        const error_msg = `Git clean failed for ${project_name}: ${err.message}`;
        errors.push(error_msg);
        console.error(error_msg);
        return {
            success: false,
            cleaned: [],
            errors,
            project_name
        };
    }
}
/**
 * Clean a single project directory by removing dist and node_modules
 * @param {string} project_path - Path to the project directory
 * @param {object} options - Cleaning options
 * @param {boolean} options.verbose - Whether to show verbose output
 * @param {boolean} options.dist_only - Whether to only clean dist directory
 * @param {boolean} options.node_modules_only - Whether to only clean node_modules directory
 * @param {boolean} options.use_git - Whether to use git clean instead of manual cleaning
 * @returns {object} - Object containing success status and cleaned directories
 */
function clean_project(project_path, options = {}) {
    const { verbose = false, dist_only = false, node_modules_only = false, use_git = false } = options;
    // If git cleaning is requested, use that instead
    if (use_git) {
        return git_clean_project(project_path, { verbose });
    }
    const project_name = path.basename(project_path);
    const cleaned = [];
    const errors = [];
    if (verbose) {
        console.log(`Cleaning ${project_name}...`);
    }
    // Clean dist directory
    if (!node_modules_only) {
        const dist_dir = path.join(project_path, 'pub', 'dist');
        if (fs.existsSync(dist_dir)) {
            try {
                fs.rmSync(dist_dir, { recursive: true, force: true });
                cleaned.push('dist');
                if (verbose) {
                    console.log('✓ Removed dist directory');
                }
            }
            catch (err) {
                const error_msg = `Failed to delete dist in ${project_name}: ${err.message}`;
                errors.push(error_msg);
                console.error(error_msg);
            }
        }
    }
    // Clean node_modules directory
    if (!dist_only) {
        const node_modules_dir = path.join(project_path, 'pub', 'node_modules');
        if (fs.existsSync(node_modules_dir)) {
            try {
                fs.rmSync(node_modules_dir, { recursive: true, force: true });
                cleaned.push('node_modules');
                if (verbose) {
                    console.log('✓ Removed node_modules directory');
                }
            }
            catch (err) {
                const error_msg = `Failed to delete node_modules in ${project_name}: ${err.message}`;
                errors.push(error_msg);
                console.error(error_msg);
            }
        }
    }
    return {
        success: errors.length === 0,
        cleaned,
        errors,
        project_name
    };
}
/**
 * Check if a directory contains a valid Node.js project
 * @param {string} project_path - Path to check
 * @returns {boolean} - True if directory contains package.json in pub subdirectory
 */
function is_node_project(project_path) {
    return fs.existsSync(path.join(project_path, 'pub', 'package.json'));
}
module.exports = {
    clean_project,
    git_clean_project,
    is_node_project
};
