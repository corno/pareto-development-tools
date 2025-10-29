/**
 * Ensure Valid Commit Function
 * 
 * This function ensures the repository has a valid latest commit by validating structure,
 * staging changes, and committing them if needed.
 * 
 * WORKFLOW:
 * =========
 * 
 * 1. STRUCTURE VALIDATION (ALWAYS)
 *    - Validates repository structure against structure.json
 *    - Performed even if there are no changes to commit
 *    - Collects warnings (non-blocking) and errors (blocking)
 *    - Fails if any structure errors are found
 * 
 * 2. CHECK STAGING AREA (if skip_validation = false)
 *    - Checks if any files are already staged
 *    - Fails if staged changes exist (use --force to bypass)
 * 
 * 3. STAGE ALL CHANGES (if skip_validation = false)
 *    - Runs 'git add .' to stage all current changes
 *    - Ok if nothing to stage
 * 
 * 4. PREPARE & VALIDATE (if skip_validation = false)
 *    4.1. CLEAN
 *         - Runs git clean -fdX to remove ignored files
 *         - Ensures clean build environment
 *    
 *    4.2. UPDATE DEPENDENCIES (if skip_dep_upgrade = false)
 *         - Runs 'update2latest . dependencies' in pub/ directory
 *         - Updates package.json to latest compatible versions
 *         - Non-fatal if update2latest is not available
 *    
 *    4.3. INSTALL DEPENDENCIES
 *         - Runs 'npm install' in pub/ directory
 *         - Runs 'npm install' in test/ directory (if exists)
 *    
 *    4.4. COPY TEMPLATES
 *         - Copies tsconfig.json template to pub/ and test/ (respects NATIVE_MODULE marker)
 *         - Copies index.ts template to pub/src/
 *    
 *    4.5. GENERATE .GITIGNORE
 *         - Generates .gitignore from structure.json
 *         - Includes all paths marked as ["generated", false]
 *    
 *    4.6. BUILD & TEST
 *         - Builds TypeScript (pub and test directories)
 *         - Makes bin files executable
 *         - Runs test suite
 *         - Fails if build or tests fail
 * 
 * 5. COMMIT
 *    - Creates commit with provided message (if there's anything staged)
 *    - Fails if commit fails
 * 
 * 6. PUSH (if skip_push = false)
 *    - Pushes to remote repository
 *    - Fails if push fails
 * 
 * OPTIONS:
 * ========
 * - skip_validation: true  - Force mode, skips all validation steps (stages + commits + pushes)
 * - skip_push: true        - Commits but doesn't push to remote
 * 
 * RETURN TYPES:
 * =============
 * - ['committed', { warnings }]           - Successfully committed (and pushed if not skipped)
 * - ['not ready', { reason }]             - Failed at some step, reason explains where/why
 * 
 * @param {string} repo_path - Path to the repository
 * @param {object} structure - Structure definition from structure.json
 * @param {function} prompt_for_commit_message - Callback function that returns a commit message (called only if needed)
 * @param {object} options - Options { skip_validation?, skip_push? }
 * @returns {Status} - Status tuple indicating result
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const validateStructureModule = require('./validate_structure');
const validate_structure = validateStructureModule.$$;
const buildAndTestModule = require('./build_and_test');
const build_and_test = buildAndTestModule.$$;
import { clean_project } from './clean_project';

/**
 * Traverse the structure and collect all paths where ["generated", false]
 * @param {Object} structure - The structure object or sub-object
 * @param {string} current_path - Current relative path
 * @returns {Array<string>} - Array of paths to ignore
 */
function collect_gitignore_paths(structure: any, current_path: string = ''): string[] {
    const ignore_paths: string[] = [];
    
    if (typeof structure === 'object' && structure !== null && !Array.isArray(structure)) {
        // It's an object with named entries
        for (const [name, value] of Object.entries(structure)) {
            const item_path = current_path ? `${current_path}/${name}` : name;
            
            if (Array.isArray(value)) {
                const [type, details] = value;
                
                if (type === 'generated' && details === false) {
                    // This should be in .gitignore
                    ignore_paths.push(item_path);
                }
            } else if (typeof value === 'object' && value !== null) {
                // Recurse into nested object
                const nested_paths = collect_gitignore_paths(value, item_path);
                ignore_paths.push(...nested_paths);
            }
        }
    }
    
    return ignore_paths;
}

export type Status =
    | ['committed', {
        warnings: string[]
    }]
    | ['not ready', {
        reason: 
        | ['structure not valid', { 
            errors: string[]
        }]
        | ['already staged', null]
        | ['tests failing', { details: string }]
        | ['build failing', { details: string }]
        | ['clean failed', { errors: string[] }]
        | ['npm install failed', { details: string }]
        | ['commit failed', { details: string }]
        | ['push failed', { details: string }]
    }]


export const $$ = async (repo_path: string, structure: any, prompt_for_commit_message: () => string | Promise<string>, options: {
    'skip_validation'?: boolean,
    'skip_push'?: boolean,
    'skip_dep_upgrade'?: boolean
} = {}): Promise<Status> => {
    const skip_validation = options.skip_validation || false;
    const skip_push = options.skip_push || false;
    const skip_dep_upgrade = options.skip_dep_upgrade || false;
    const all_warnings: string[] = [];
    let we_staged = false; // Track if we staged files
    
    // Helper to unstage if we staged
    const unstage_if_needed = () => {
        if (we_staged) {
            try {
                execSync('git reset', { cwd: repo_path, stdio: 'pipe' });
            } catch {
                // Ignore errors during cleanup
            }
        }
    };
    
    // 1. ALWAYS validate structure first (even if no changes)
    const validation_result = validate_structure(repo_path, structure);
    
    if (validation_result[0] === 'not valid') {
        return ['not ready', {
            reason: ['structure not valid', {
                errors: validation_result[1].errors
            }]
        }];
    }
    
    // Collect warnings from structure validation
    all_warnings.push(...validation_result[1].warnings);
    
    if (!skip_validation) {
        // 2. Check if anything is already staged
        try {
            const staged = execSync('git diff --cached --name-only', { cwd: repo_path, encoding: 'utf8' }).trim();
            if (staged.length > 0) {
                return ['not ready', {
                    reason: ['already staged', null]
                }];
            }
        } catch (err: any) {
            return ['not ready', {
                reason: ['commit failed', {
                    details: `Failed to check staged files: ${err.message}`
                }]
            }];
        }
        
        // 3. Stage all changes (ok if nothing to stage)
        try {
            execSync('git add .', { cwd: repo_path, stdio: 'pipe' });
            we_staged = true; // Mark that we staged files
        } catch (err: any) {
            return ['not ready', {
                reason: ['commit failed', {
                    details: `Failed to stage changes: ${err.message}`
                }]
            }];
        }
        
        // 4. Clean
        try {
            clean_project(repo_path, { verbose: false, use_git: true });
        } catch (err: any) {
            unstage_if_needed();
            return ['not ready', {
                reason: ['clean failed', {
                    errors: [err.message]
                }]
            }];
        }
        
        // 5. Update and install dependencies
        // 5.1. Update dependencies to latest (unless skip_dep_upgrade is set)
        if (!skip_dep_upgrade) {
            try {
                console.log('Updating dependencies to latest...');
                execSync('update2latest . dependencies', { cwd: path.join(repo_path, 'pub'), stdio: 'inherit' });
            } catch (err: any) {
                // update2latest failure is a warning, not fatal - might not be installed
                all_warnings.push(`Failed to update dependencies: ${err.message}`);
            }
        }
        
        // 5.2. Install dependencies
        try {
            execSync('npm install', { cwd: path.join(repo_path, 'pub'), stdio: 'inherit' });
            const test_dir = path.join(repo_path, 'test');
            if (fs.existsSync(test_dir) && fs.existsSync(path.join(test_dir, 'package.json'))) {
                execSync('npm install', { cwd: test_dir, stdio: 'inherit' });
            }
        } catch (err: any) {
            unstage_if_needed();
            return ['not ready', {
                reason: ['npm install failed', {
                    details: `npm install failed. See output above for details.`
                }]
            }];
        }
        
        // 5.5. Copy templates (tsconfig.json and index.ts)
        try {
            // Find tools directory (assuming this script is in tools/pub/dist/lib)
            const tools_dir = path.join(__dirname, '../../..');
            
            // Check for NATIVE_MODULE marker
            const native_module_marker = path.join(repo_path, 'NATIVE_MODULE');
            const has_native_module = fs.existsSync(native_module_marker);
            
            // Select the correct template based on NATIVE_MODULE marker
            const template_name = has_native_module ? 'tsconfig_native.json' : 'tsconfig_nolib.json';
            const template_tsconfig = path.join(tools_dir, 'data', 'templates', template_name);
            const template_tsconfig_nolib = path.join(tools_dir, 'data', 'templates', 'tsconfig_nolib.json');
            const template_index = path.join(tools_dir, 'data', 'templates', 'index.ts');
            const pub_tsconfig = path.join(repo_path, 'pub', 'tsconfig.json');
            const pub_index = path.join(repo_path, 'pub', 'src', 'index.ts');
            const test_tsconfig = path.join(repo_path, 'test', 'tsconfig.json');
            
            if (fs.existsSync(template_tsconfig)) {
                // Copy to pub (unless NATIVE_MODULE marker exists in root)
                if (fs.existsSync(pub_tsconfig)) {
                    if (!has_native_module) {
                        fs.copyFileSync(template_tsconfig, pub_tsconfig);
                    }
                }
                // Copy to test if it exists (always use nolib version for test)
                if (fs.existsSync(path.join(repo_path, 'test')) && fs.existsSync(test_tsconfig)) {
                    fs.copyFileSync(template_tsconfig_nolib, test_tsconfig);
                }
            }
            
            // Copy index.ts template to pub/src (always, even for native modules)
            if (fs.existsSync(template_index)) {
                if (fs.existsSync(path.join(repo_path, 'pub', 'src'))) {
                    fs.copyFileSync(template_index, pub_index);
                }
            }
        } catch (err: any) {
            // Template copying is not critical, just log a warning
            all_warnings.push(`Failed to copy templates: ${err.message}`);
        }
        
        // 5.6. Generate .gitignore from structure.json
        try {
            const gitignore_paths = collect_gitignore_paths(structure);
            const gitignore_content = [
                '# Auto-generated from structure.json',
                '# Paths marked as ["generated", false]',
                '',
                ...gitignore_paths.map((p: string) => `/${p}`),
                ''
            ].join('\n');
            const gitignore_path = path.join(repo_path, '.gitignore');
            fs.writeFileSync(gitignore_path, gitignore_content);
        } catch (err: any) {
            // .gitignore generation is not critical, just log a warning
            all_warnings.push(`Failed to generate .gitignore: ${err.message}`);
        }
        
        // 6. Build and test
        try {
            const result = build_and_test(repo_path, {
                verbose: true,
                throw_on_error: false
            });
            
            if (result[0] === 'failure') {
                unstage_if_needed();
                const [reason_type, reason_details] = result[1].reason;
                return ['not ready', {
                    reason: [reason_type, {
                        details: reason_details.details
                    }]
                }];
            }
        } catch (err: any) {
            unstage_if_needed();
            return ['not ready', {
                reason: ['build failing', {
                    details: err.message || 'Unknown error'
                }]
            }];
        }
    } else {
        // Skip validation mode: just stage everything
        try {
            execSync('git add .', { cwd: repo_path, stdio: 'pipe' });
            we_staged = true; // Mark that we staged files
        } catch (err: any) {
            return ['not ready', {
                reason: ['commit failed', {
                    details: `Failed to stage changes: ${err.message}`
                }]
            }];
        }
    }
    
    // 7. Commit (will only commit if there's something staged)
    try {
        // Check if there's anything staged to commit
        const staged = execSync('git diff --cached --name-only', { cwd: repo_path, encoding: 'utf8' }).trim();
        if (staged.length > 0) {
            // Get commit message from callback (may be async)
            const commit_message = await Promise.resolve(prompt_for_commit_message());
            if (!commit_message || commit_message.trim().length === 0) {
                unstage_if_needed();
                return ['not ready', {
                    reason: ['commit failed', {
                        details: `Commit message cannot be empty (received: "${commit_message}")`
                    }]
                }];
            }
            execSync(`git commit -m "${commit_message}"`, { cwd: repo_path, stdio: 'pipe' });
        }
    } catch (err: any) {
        unstage_if_needed();
        return ['not ready', {
            reason: ['commit failed', {
                details: err.message || 'Unknown error'
            }]
        }];
    }
    
    // 8. Push (unless skipped)
    if (!skip_push) {
        try {
            execSync('git push', { cwd: repo_path, stdio: 'pipe' });
        } catch (err: any) {
            return ['not ready', {
                reason: ['push failed', {
                    details: err.message || 'Unknown error'
                }]
            }];
        }
    }
    
    // All done!
    return ['committed', {
        warnings: all_warnings
    }];
}
