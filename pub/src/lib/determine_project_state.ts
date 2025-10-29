import { Project_State } from "../interface/project_state";
const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const validateStructureModule = require('./validate_structure');
const validate_structure = validateStructureModule.$$;
const buildAndTestModule = require('./build_and_test');
const build_and_test = buildAndTestModule.$$;

/**
 * Check git status to determine staged files, dirty working tree, and unpushed commits
 */
function determine_git_state(project_path: string): Project_State['git'] {
    try {
        // Check for staged files
        const staged = execSync('git diff --cached --name-only', { cwd: project_path, encoding: 'utf8' }).trim();
        const has_staged_files = staged.length > 0;

        // Check for dirty working tree (unstaged changes)
        const unstaged = execSync('git diff --name-only', { cwd: project_path, encoding: 'utf8' }).trim();
        const untracked = execSync('git ls-files --others --exclude-standard', { cwd: project_path, encoding: 'utf8' }).trim();
        const has_dirty_working_tree = unstaged.length > 0 || untracked.length > 0;

        // Check for unpushed commits
        let has_unpushed_commits = false;
        try {
            // Get the current branch
            const current_branch = execSync('git rev-parse --abbrev-ref HEAD', { cwd: project_path, encoding: 'utf8' }).trim();
            
            // Check if remote branch exists and compare
            try {
                const local_commit = execSync(`git rev-parse ${current_branch}`, { cwd: project_path, encoding: 'utf8' }).trim();
                const remote_commit = execSync(`git rev-parse origin/${current_branch}`, { cwd: project_path, encoding: 'utf8' }).trim();
                has_unpushed_commits = local_commit !== remote_commit;
            } catch {
                // Remote branch might not exist, assume unpushed commits
                has_unpushed_commits = true;
            }
        } catch {
            // Error getting branch info, assume no unpushed commits
            has_unpushed_commits = false;
        }

        return {
            'staged files': has_staged_files,
            'dirty working tree': has_dirty_working_tree,
            'unpushed commits': has_unpushed_commits
        };
    } catch (err) {
        // If git commands fail, assume safe defaults
        return {
            'staged files': false,
            'dirty working tree': false,
            'unpushed commits': false
        };
    }
}

/**
 * Check dependencies status by examining package.json files
 */
function determine_dependencies_state(project_path: string): Project_State['dependencies'] {
    const dependencies: Project_State['dependencies'] = {};
    
    // Check pub/package.json
    const pub_package_path = path.join(project_path, 'pub', 'package.json');
    if (fs.existsSync(pub_package_path)) {
        try {
            const package_content = JSON.parse(fs.readFileSync(pub_package_path, 'utf8'));
            const all_deps = {
                ...package_content.dependencies || {},
                ...package_content.devDependencies || {}
            };
            
            for (const [packageName, version] of Object.entries(all_deps)) {
                try {
                    // Try to get package info from npm
                    const npm_info = execSync(`npm view ${packageName} version`, { 
                        cwd: path.join(project_path, 'pub'), 
                        encoding: 'utf8',
                        stdio: 'pipe'
                    }).trim();
                    
                    // Check if installed version matches latest
                    const node_modules_path = path.join(project_path, 'pub', 'node_modules', packageName, 'package.json');
                    let is_up_to_date = false;
                    
                    if (fs.existsSync(node_modules_path)) {
                        const installed_package = JSON.parse(fs.readFileSync(node_modules_path, 'utf8'));
                        is_up_to_date = installed_package.version === npm_info;
                    }
                    
                    dependencies[packageName] = ['target found', {
                        'up to date': is_up_to_date
                    }];
                } catch {
                    // Package not found in npm registry
                    dependencies[packageName] = ['target not found', null];
                }
            }
        } catch {
            // Error reading package.json
        }
    }
    
    // Check test/package.json if it exists
    const test_package_path = path.join(project_path, 'test', 'package.json');
    if (fs.existsSync(test_package_path)) {
        try {
            const package_content = JSON.parse(fs.readFileSync(test_package_path, 'utf8'));
            const all_deps = {
                ...package_content.dependencies || {},
                ...package_content.devDependencies || {}
            };
            
            for (const [packageName, version] of Object.entries(all_deps)) {
                // Skip if already checked in pub
                if (packageName in dependencies) continue;
                
                try {
                    const npm_info = execSync(`npm view ${packageName} version`, { 
                        cwd: path.join(project_path, 'test'), 
                        encoding: 'utf8',
                        stdio: 'pipe'
                    }).trim();
                    
                    const node_modules_path = path.join(project_path, 'test', 'node_modules', packageName, 'package.json');
                    let is_up_to_date = false;
                    
                    if (fs.existsSync(node_modules_path)) {
                        const installed_package = JSON.parse(fs.readFileSync(node_modules_path, 'utf8'));
                        is_up_to_date = installed_package.version === npm_info;
                    }
                    
                    dependencies[packageName] = ['target found', {
                        'up to date': is_up_to_date
                    }];
                } catch {
                    dependencies[packageName] = ['target not found', null];
                }
            }
        } catch {
            // Error reading test package.json
        }
    }
    
    return dependencies;
}

export function determine_project_state(project_path: string): Project_State {
    // 1. Determine Git State
    const git_state = determine_git_state(project_path);

    // 2. Load structure.json and validate structure
    let structure_state: Project_State['structure'];
    try {
        // Assuming this function is called from tools, look for structure.json in data directory
        const tools_dir = path.join(__dirname, '../../..');
        const structure_path = path.join(tools_dir, 'data', 'structure.json');
        
        if (!fs.existsSync(structure_path)) {
            throw new Error(`Structure file not found at: ${structure_path}`);
        }
        
        const structure_content = fs.readFileSync(structure_path, 'utf8');
        const structure = JSON.parse(structure_content);
        
        const structure_result = validate_structure(project_path, structure);
        
        if (structure_result[0] === 'not valid') {
            structure_state = ['invalid', { errors: structure_result[1].errors }];
        } else {
            structure_state = ['valid', { warnings: structure_result[1].warnings }];
        }
    } catch (err: any) {
        // If we can't load structure.json, we can't validate anything
        structure_state = ['invalid', { errors: [`Failed to load structure.json: ${err.message}`] }];
    }

    // 3. Run build and test
    let test_state: Project_State['test'];
    try {
        const build_test_result = build_and_test(project_path, {
            verbose: false,
            throw_on_error: false,
            skip_tests: false
        });
        
        if (build_test_result[0] === 'success') {
            test_state = ['success', null];
        } else {
            const [reason_type, reason_details] = build_test_result[1].reason;
            if (reason_type === 'build failing') {
                test_state = ['failure', ['build', null]];
            } else if (reason_type === 'tests failing') {
                // Extract failed test information if available
                test_state = ['failure', ['test', { failed_tests: [reason_details.details] }]];
            } else {
                // Fallback for unknown error types
                test_state = ['failure', ['build', null]];
            }
        }
    } catch (err: any) {
        // If build_and_test throws an error, treat it as build failure
        test_state = ['failure', ['build', null]];
    }

    // 4. Determine dependencies state
    const dependencies_state = determine_dependencies_state(project_path);

    return {
        git: git_state,
        structure: structure_state,
        test: test_state,
        dependencies: dependencies_state
    };
}