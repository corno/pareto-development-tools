/**
 * Repository Commit Function
 * 
 * This function commits changes to a repository through a comprehensive validation pipeline.
 * 
 * COMMIT FLOW:
 * ============
 * 
 * 1. STRUCTURE VALIDATION (ALWAYS)
 *    - Validates repository structure against structure.json
 *    - Performed even if there are no changes to commit
 *    - Collects warnings (non-blocking) and errors (blocking)
 *    - Fails if any structure errors are found
 * 
 * 2. VALIDATE & PREPARE (if skip_validation = false)
 *    2.1. CHECK STAGED CHANGES
 *         - Checks if any files are already staged
 *         - Fails if staged changes exist (use --force to bypass)
 *    
 *    2.2. STAGE ALL CHANGES
 *         - Runs 'git add .' to stage all changes
 *         - Ok if nothing to stage
 *    
 *    2.3. CLEAN
 *         - Runs git clean -fdX to remove ignored files
 *         - Ensures clean build environment
 *    
 *    2.4. INSTALL DEPENDENCIES
 *         - Runs 'npm install' in pub/ directory
 *         - Runs 'npm install' in test/ directory (if exists)
 *    
 *    2.5. COPY TEMPLATES
 *         - Copies tsconfig.json template to pub/ and test/ (respects NATIVE_MODULE marker)
 *         - Copies index.ts template to pub/src/
 *    
 *    2.6. BUILD & TEST
 *         - Builds TypeScript (pub and test directories)
 *         - Makes bin files executable
 *         - Runs test suite
 *         - Fails if build or tests fail
 * 
 * 3. COMMIT
 *    - Creates commit with provided message (if there's anything staged)
 *    - Fails if commit fails
 * 
 * 4. PUSH (if skip_push = false)
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
 * @param {string} commit_message - Commit message
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


export const $$ = (repo_path: string, structure: any, commit_message: string, options: {
    'skip_validation'?: boolean,
    'skip_push'?: boolean
} = {}): Status => {
    const skip_validation = options.skip_validation || false;
    const skip_push = options.skip_push || false;
    const all_warnings: string[] = [];
    
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
            return ['not ready', {
                reason: ['clean failed', {
                    errors: [err.message]
                }]
            }];
        }
        
        // 5. Install dependencies
        try {
            execSync('npm install', { cwd: path.join(repo_path, 'pub'), stdio: 'pipe' });
            const test_dir = path.join(repo_path, 'test');
            if (fs.existsSync(test_dir) && fs.existsSync(path.join(test_dir, 'package.json'))) {
                execSync('npm install', { cwd: test_dir, stdio: 'pipe' });
            }
        } catch (err: any) {
            return ['not ready', {
                reason: ['npm install failed', {
                    details: err.message || 'Unknown error'
                }]
            }];
        }
        
        // 5.5. Copy templates (tsconfig.json and index.ts)
        try {
            // Find tools directory (assuming this script is in tools/pub/dist/lib)
            const tools_dir = path.join(__dirname, '../../../..');
            
            // Check for NATIVE_MODULE marker
            const native_module_marker = path.join(repo_path, 'NATIVE_MODULE');
            const has_native_module = fs.existsSync(native_module_marker);
            
            // Select the correct template based on NATIVE_MODULE marker
            const template_name = has_native_module ? 'tsconfig_native.json' : 'tsconfig_nolib.json';
            const template_tsconfig = path.join(tools_dir, 'data', 'templates', template_name);
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
                // Copy to test if it exists (always, NATIVE_MODULE doesn't affect test)
                if (fs.existsSync(path.join(repo_path, 'test')) && fs.existsSync(test_tsconfig)) {
                    fs.copyFileSync(template_tsconfig, test_tsconfig);
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
        
        // 6. Build and test
        try {
            // Find tools directory (go up from this module to the root)
            const tools_dir = path.join(__dirname, '../../../..');
            const native_module_marker = path.join(repo_path, 'NATIVE_MODULE');
            const has_native_module = fs.existsSync(native_module_marker);
            
            // Select the correct template based on NATIVE_MODULE marker
            const template_name = has_native_module ? 'tsconfig_native.json' : 'tsconfig_nolib.json';
            const template_tsconfig = path.join(tools_dir, 'data', 'templates', template_name);
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
                // Copy to test if it exists (always, NATIVE_MODULE doesn't affect test)
                if (fs.existsSync(path.join(repo_path, 'test')) && fs.existsSync(test_tsconfig)) {
                    fs.copyFileSync(template_tsconfig, test_tsconfig);
                }
            } else {
                return ['not ready', {
                    reason: ['commit failed', {
                        details: `Template not found: ${template_name} at ${template_tsconfig}`
                    }]
                }];
            }
            
            // Copy index.ts template to pub/src (always, even for native modules)
            if (fs.existsSync(template_index)) {
                if (fs.existsSync(path.join(repo_path, 'pub', 'src'))) {
                    fs.copyFileSync(template_index, pub_index);
                }
            } else {
                return ['not ready', {
                    reason: ['commit failed', {
                        details: `Template not found: index.ts at ${template_index}`
                    }]
                }];
            }
        } catch (err: any) {
            return ['not ready', {
                reason: ['commit failed', {
                    details: `Failed to copy templates: ${err.message}`
                }]
            }];
        }
        
        // 6. Build and test
        try {
            const result = build_and_test(repo_path, {
                verbose: false,
                throw_on_error: false
            });
            
            if (result[0] === 'failure') {
                const [reason_type, reason_details] = result[1].reason;
                return ['not ready', {
                    reason: [reason_type, {
                        details: reason_details.details
                    }]
                }];
            }
        } catch (err: any) {
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
        execSync(`git commit -m "${commit_message}"`, { cwd: repo_path, stdio: 'pipe' });
    } catch (err: any) {
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
