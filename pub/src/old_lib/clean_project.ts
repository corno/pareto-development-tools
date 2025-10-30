
import * as fs from 'fs';
import * as path from 'path';
import { execSync } from 'child_process';

export interface CleanOptions {
    verbose?: boolean;
    dist_only?: boolean;
    node_modules_only?: boolean;
    use_git?: boolean;
}

/**
 * Clean a project directory by removing dist and node_modules, or using git clean
 * @param project_path - Path to the project directory
 * @param options - Cleaning options
 * @throws Error if cleaning fails
 */
export function clean_project(project_path: string, options: CleanOptions = {}): void {
    const { verbose = false, dist_only = false, node_modules_only = false, use_git = false } = options;
    
    /**
     * Clean using git clean -fdX (removes all ignored files)
     * @param project_path - Path to the project directory
     * @param options - Cleaning options
     * @throws Error if git cleaning fails
     */
    function git_clean_project(project_path: string, options: Pick<CleanOptions, 'verbose'> = {}): void {
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
            execSync('git --version', { stdio: 'pipe' });
        } catch (err) {
            throw new Error(`Git command not found for ${project_name}`);
        }

        // Check if directory is a git repository
        try {
            execSync('git rev-parse --git-dir', { cwd: project_path, stdio: 'pipe' });
        } catch (err) {
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
                execSync(git_clean_cmd, { cwd: project_path, stdio: 'inherit' });
                console.log('✓ Git clean completed');
            } else {
                const output = execSync(git_clean_cmd, { cwd: project_path, encoding: 'utf8' });
                if (output.trim()) {
                    if (verbose) {
                        console.log('✓ Removed ignored files and directories');
                        console.log(output);
                    }
                } else {
                    if (verbose) {
                        console.log('✓ No ignored files to clean');
                    }
                }
            }
        } catch (err: any) {
            throw new Error(`Git clean failed for ${project_name}: ${err.message}`);
        }
    }

    /**
     * Check if a directory contains a valid Node.js project
     * @param project_path - Path to check
     * @returns True if directory contains package.json in pub subdirectory
     */
    function is_node_project(project_path: string): boolean {
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
            } catch (err: any) {
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
            } catch (err: any) {
                throw new Error(`Failed to delete node_modules in ${project_name}: ${err.message}`);
            }
        }
    }
}