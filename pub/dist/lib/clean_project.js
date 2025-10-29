"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.clean_project = clean_project;
const fs = __importStar(require("fs"));
const path = __importStar(require("path"));
const child_process_1 = require("child_process");
/**
 * Clean a project directory by removing dist and node_modules, or using git clean
 * @param project_path - Path to the project directory
 * @param options - Cleaning options
 * @throws Error if cleaning fails
 */
function clean_project(project_path, options = {}) {
    const { verbose = false, dist_only = false, node_modules_only = false, use_git = false } = options;
    /**
     * Clean using git clean -fdX (removes all ignored files)
     * @param project_path - Path to the project directory
     * @param options - Cleaning options
     * @throws Error if git cleaning fails
     */
    function git_clean_project(project_path, options = {}) {
        const { verbose = false } = options;
        const project_name = path.basename(project_path);
        if (verbose) {
            console.log(`Git cleaning ${project_name}...`);
        }
        // Check if .gitignore exists
        const gitignore_path = path.join(project_path, '.gitignore');
        if (!fs.existsSync(gitignore_path)) {
            throw new Error(`No .gitignore file found in ${project_name}`);
        }
        // Check if git is available
        try {
            (0, child_process_1.execSync)('git --version', { stdio: 'pipe' });
        }
        catch (err) {
            throw new Error(`Git command not found for ${project_name}`);
        }
        // Check if directory is a git repository
        try {
            (0, child_process_1.execSync)('git rev-parse --git-dir', { cwd: project_path, stdio: 'pipe' });
        }
        catch (err) {
            throw new Error(`${project_name} is not a git repository`);
        }
        try {
            // Use git clean to remove ignored files
            // -f: force removal
            // -d: remove directories
            // -X: remove only ignored files (not untracked files)
            const git_clean_cmd = 'git clean -fdX';
            if (verbose) {
                console.log(`Running: ${git_clean_cmd}`);
                (0, child_process_1.execSync)(git_clean_cmd, { cwd: project_path, stdio: 'inherit' });
                console.log('✓ Git clean completed');
            }
            else {
                const output = (0, child_process_1.execSync)(git_clean_cmd, { cwd: project_path, encoding: 'utf8' });
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
        }
        catch (err) {
            throw new Error(`Git clean failed for ${project_name}: ${err.message}`);
        }
    }
    /**
     * Check if a directory contains a valid Node.js project
     * @param project_path - Path to check
     * @returns True if directory contains package.json in pub subdirectory
     */
    function is_node_project(project_path) {
        return fs.existsSync(path.join(project_path, 'pub', 'package.json'));
    }
    // If git cleaning is requested, use that instead
    if (use_git) {
        git_clean_project(project_path, { verbose });
        return;
    }
    const project_name = path.basename(project_path);
    if (verbose) {
        console.log(`Cleaning ${project_name}...`);
    }
    // Clean dist directory
    if (!node_modules_only) {
        const dist_dir = path.join(project_path, 'pub', 'dist');
        if (fs.existsSync(dist_dir)) {
            try {
                fs.rmSync(dist_dir, { recursive: true, force: true });
                if (verbose) {
                    console.log('✓ Removed dist directory');
                }
            }
            catch (err) {
                throw new Error(`Failed to delete dist in ${project_name}: ${err.message}`);
            }
        }
    }
    // Clean node_modules directory
    if (!dist_only) {
        const node_modules_dir = path.join(project_path, 'pub', 'node_modules');
        if (fs.existsSync(node_modules_dir)) {
            try {
                fs.rmSync(node_modules_dir, { recursive: true, force: true });
                if (verbose) {
                    console.log('✓ Removed node_modules directory');
                }
            }
            catch (err) {
                throw new Error(`Failed to delete node_modules in ${project_name}: ${err.message}`);
            }
        }
    }
}
