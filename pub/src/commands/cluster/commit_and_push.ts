#!/usr/bin/env node
import { execSync } from 'child_process';
import * as fs from 'fs';
import * as path from 'path';
import { clean_project } from '../../lib/clean_utils';
import { analyze_dependencies, get_build_order } from '../../lib/dependency_graph_utils';
import * as determineCommitReadinessModule from '../../lib/determine_commit_readiness';

function main(): void {
    const determine_commit_readiness = determineCommitReadinessModule.$$;
    const args = process.argv.slice(2);
    
    // Parse flags
    const is_force = args.includes('--force');
    const default_commit_idx = args.indexOf('--default-commit-message');
    const has_default_commit_flag = default_commit_idx !== -1;
    
    let default_commit_message = '';
    if (has_default_commit_flag) {
        // Check if there's a value after --default-commit-message
        if (default_commit_idx + 1 < args.length && !args[default_commit_idx + 1].startsWith('--')) {
            default_commit_message = args[default_commit_idx + 1];
        } else {
            default_commit_message = 'Update cluster projects';
        }
    }
    
    // Filter out flag arguments to get positional arguments
    const non_flag_args = args.filter((arg, index) => {
        if (arg.startsWith('--')) return false;
        // Skip the value following --default-commit-message
        if (index > 0 && args[index - 1] === '--default-commit-message') return false;
        return true;
    });
    
    // Determine required arguments based on whether we have --default-commit-message
    const required_args = has_default_commit_flag ? 1 : 2;
    
    if (non_flag_args.length < required_args) {
        if (has_default_commit_flag) {
            console.error('Usage: pareto cluster-commit <directory> [--default-commit-message [message]] [--force]');
        } else {
            console.error('Usage: pareto cluster-commit <directory> "<commit message>" [--force]');
            console.error('       pareto cluster-commit <directory> [--default-commit-message [message]] [--force]');
        }
        console.error('');
        console.error('Default behavior:');
        console.error('  - Validates no changes are staged (aborts if staged changes exist)');
        console.error('  - Stages all changes');
        console.error('  - Performs clean → install → build → test');
        console.error('  - Commits and pushes only if tests pass');
        console.error('');
        console.error('Flags:');
        console.error('  --force: Skips build/test validation and commits/pushes immediately');
        console.error('  --default-commit-message [msg]: Use default or specified commit message');
        process.exit(1);
    }
    
    const target_dir = non_flag_args[0];
    let commit_message: string;
    
    if (has_default_commit_flag) {
        commit_message = default_commit_message;
        console.log(`Using default commit message: "${commit_message}"`);
    } else {
        commit_message = non_flag_args[1];
        if (!commit_message) {
            console.error('Error: Please provide a commit message or use --default-commit-message');
            process.exit(1);
        }
    }
    
    if (!target_dir) {
        console.error('Error: Please provide a target directory path');
        process.exit(1);
    }
    const base_dir = path.resolve(target_dir);
    if (!fs.existsSync(base_dir)) {
        console.error(`Error: Directory ${target_dir} does not exist`);
        process.exit(1);
    }
    const get_relative_path = (absolute_path) => {
        const rel = path.relative(process.cwd(), absolute_path);
        return rel.startsWith('..') || rel.startsWith('.') ? rel : './' + rel;
    };
    const structure_path = path.join(__dirname, '../../../..', 'data', 'structure.json');
    let allowed_structure = null;
    try {
        allowed_structure = JSON.parse(fs.readFileSync(structure_path, 'utf8'));
    } catch (err) {
        console.error('Warning: Could not load structure.json, skipping structure validation');
    }
    console.log('Analyzing dependencies to determine commit order...');
    const dep_graph = analyze_dependencies(base_dir, true);
    if (dep_graph.projects.length === 0) {
        console.error('No Node.js projects found in the specified directory');
        process.exit(1);
    }
    let commit_order;
    try {
        commit_order = get_build_order(dep_graph);
    } catch (err) {
        console.error(`Error: ${err.message}`);
        process.exit(1);
    }
    console.log(`Found ${commit_order.length} projects to process in dependency order:`);
    commit_order.forEach((project, index) => {
        const deps = dep_graph.dependency_map.get(project.name) || [];
        const dep_info = deps.length > 0 ? ` (depends on: ${deps.join(', ')})` : '';
        console.log(`  ${index + 1}. ${get_relative_path(project.path)}${dep_info}`);
    });
    console.log(`\n${is_force ? 'Force committing' : 'Committing'} repositories in ${get_relative_path(base_dir)}`);
    console.log(`Commit message: "${commit_message}"`);
    if (is_force) {
        console.log('⚠️  --force flag: Skipping build and test validation\n');
    }
    let processed_count = 0;
    let skipped_count = 0;
    let failed_count = 0;
    const failed_repos = [];
    for (const project of commit_order) {
        console.log(`\nProcessing ${get_relative_path(project.path)}...`);
        
        try {
            // Check for changes
            const status = execSync('git status --porcelain', { cwd: project.path, encoding: 'utf8' }).trim();
            
            if (status.length === 0) {
                console.log(`  No changes in ${get_relative_path(project.path)}`);
                skipped_count++;
                continue;
            }
            
            if (!is_force) {
                // Check if anything is already staged
                const staged = execSync('git diff --cached --name-only', { cwd: project.path, encoding: 'utf8' }).trim();
                if (staged.length > 0) {
                    console.error(`  ❌ Staged changes detected in ${get_relative_path(project.path)} - aborting`);
                    console.error(`     Use --force to bypass validation or unstage changes first`);
                    failed_repos.push({ name: project.name, path: project.path, reason: 'Staged changes detected' });
                    failed_count++;
                    continue;
                }
                
                // Stage all changes
                console.log(`  Staging all changes...`);
                execSync('git add .', { cwd: project.path, stdio: 'inherit' });
                
                // Clean
                console.log(`  Cleaning...`);
                try {
                    clean_project(project.path, { 
                        verbose: false, 
                        use_git: true,
                        dist_only: false,
                        node_modules_only: false
                    });
                } catch (err: any) {
                    console.error(`❌ Failed to clean ${project.name}: ${err.message}`);
                    continue;
                }
                
                // Install dependencies
                console.log(`  Installing dependencies...`);
                try {
                    execSync('npm install', { cwd: path.join(project.path, 'pub'), stdio: 'inherit' });
                    const test_dir = path.join(project.path, 'test');
                    if (fs.existsSync(test_dir) && fs.existsSync(path.join(test_dir, 'package.json'))) {
                        execSync('npm install', { cwd: test_dir, stdio: 'inherit' });
                    }
                } catch (err) {
                    console.error(`  ❌ npm install failed for ${get_relative_path(project.path)}`);
                    failed_repos.push({ name: project.name, path: project.path, reason: 'npm install failed' });
                    failed_count++;
                    continue;
                }
                
                // Validate commit readiness (structure, build, test)
                if (allowed_structure) {
                    console.log(`  Validating commit readiness...`);
                    const readiness = determine_commit_readiness(project.path, allowed_structure);
                    
                    if (readiness[0] === 'not ready') {
                        const [reason_type, reason_details] = readiness[1].reason;
                        console.error(`  ❌ ${reason_type} for ${get_relative_path(project.path)}`);
                        if (reason_type === 'structure not valid') {
                            reason_details.errors.forEach(err => console.error(`     ${err}`));
                        } else {
                            console.error(`     ${reason_details.details}`);
                        }
                        failed_repos.push({ name: project.name, path: project.path, reason: reason_type });
                        failed_count++;
                        continue;
                    }
                    
                    // Show warnings if any
                    if (readiness[1].warnings.length > 0) {
                        console.log(`  ⚠️  Warnings:`);
                        readiness[1].warnings.forEach(warn => console.log(`     ${warn}`));
                    }
                } else {
                    console.log(`  ⚠️  Skipping structure validation (structure.json not found)`);
                }
                
                console.log(`  ✓ Build and tests passed`);
            } else {
                // Force mode: just stage everything
                execSync('git add .', { cwd: project.path, stdio: 'inherit' });
            }
            
            // Commit
            execSync(`git commit -m "${commit_message}"`, { cwd: project.path, stdio: 'inherit' });
            console.log(`  ✓ Committed`);
            
            // Push
            execSync('git push', { cwd: project.path, stdio: 'inherit' });
            console.log(`  ✓ Pushed`);
            
            processed_count++;
        } catch (err) {
            console.error(`  ❌ Failed to process ${get_relative_path(project.path)}:`, err.message);
            failed_repos.push({ name: project.name, path: project.path, reason: `Exception: ${err.message}` });
            failed_count++;
        }
    }
    console.log(`\n${'='.repeat(60)}`);
    console.log(`Summary:`);
    console.log(`  ✓ ${processed_count} repositories committed and pushed`);
    console.log(`  - ${skipped_count} repositories skipped (no changes)`);
    console.log(`  ❌ ${failed_count} repositories failed`);
    if (failed_repos.length > 0) {
        console.log(`\nFailed repositories:`);
        failed_repos.forEach(repo => {
            console.log(`  ❌ ${repo.name} (${get_relative_path(repo.path)}) - ${repo.reason}`);
        });
    }
    if (failed_count > 0) {
        process.exit(1);
    }
}

main();
