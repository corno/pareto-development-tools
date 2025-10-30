#!/usr/bin/env node

import * as fs from 'fs';
import * as path from 'path';
import * as readline from 'readline';
import * as ensureValidCommitModule from '../lib/ensure_valid_commit';

async function main(): Promise<void> {
    /**
     * Ensure Valid Commit Command
     * 
     * This command ensures the repository has a valid latest commit by:
     * 1. Validating structure
     * 2. Checking staging area is clean
     * 3. Staging all changes
     * 4. Cleaning, installing dependencies, copying templates, generating .gitignore
     * 5. Building and testing
     * 6. Committing with provided message
     * 7. Pushing to remote (unless --no-push)
     * 
     * See ensure_valid_commit.ts for complete workflow details.
     * 
     * @usage ./ensure_valid_commit.js <package-directory> <commit-message> [--force] [--no-push]
     */
    const ensure_valid_commit = ensureValidCommitModule.$$;
    function prompt_user(question) {
        const rl = readline.createInterface({
            input: process.stdin,
            output: process.stdout
        });
        
        return new Promise((resolve) => {
            rl.question(question, (answer) => {
                rl.close();
                resolve(answer.trim());
            });
        });
    }
    const args = process.argv.slice(2);
    const non_flag_args = args.filter(arg => !arg.startsWith('-'));
    const package_dir = non_flag_args[0];
    const commit_message_arg = non_flag_args[1];
    const is_force = args.includes('--force');
    const no_push = args.includes('--no-push');
    const skip_dep_upgrade = args.includes('--skip-dep-upgrade');
    if (!package_dir) {
        console.error('Usage: ensure_valid_commit.js <package-directory> [commit-message] [--force] [--no-push] [--skip-dep-upgrade]');
        console.error('  commit-message       Optional commit message (will prompt if not provided)');
        console.error('  --force              Skip validation steps (force commit)');
        console.error('  --no-push            Commit but do not push to remote');
        console.error('  --skip-dep-upgrade   Skip dependency upgrade (only install)');
        process.exit(1);
    }
    const package_path = path.resolve(package_dir);
    if (!fs.existsSync(package_path)) {
        console.error(`Error: Package directory not found: ${package_path}`);
        process.exit(1);
    }
    const tools_dir = path.resolve(__dirname, '../../..');
    const structure_json_path = path.join(tools_dir, 'data', 'structure.json');
    if (!fs.existsSync(structure_json_path)) {
        console.error(`Error: structure.json not found at ${structure_json_path}`);
        process.exit(1);
    }
    const structure = JSON.parse(fs.readFileSync(structure_json_path, 'utf8'));
    console.log(`Ensuring valid commit for: ${path.basename(package_path)}`);
    if (is_force) {
        console.log('⚠️  FORCE mode: Skipping validation steps');
    }
    if (no_push) {
        console.log('📌 Will not push to remote');
    }
    const result = await ensure_valid_commit(package_path, structure, async () => {
        // Only prompt if commit message wasn't provided
        if (commit_message_arg) {
            return commit_message_arg;
        }
        return await prompt_user('Enter commit message: ') as string;
    }, {
        skip_validation: is_force,
        skip_push: no_push,
        skip_dep_upgrade: skip_dep_upgrade
    });
    if (result[0] === 'committed') {
        console.log('\n✅ Success! Valid commit ensured' + (no_push ? '' : ' and pushed'));
        if (result[1].warnings.length > 0) {
            console.log('\n⚠️  Warnings:');
            result[1].warnings.forEach(warning => {
                console.log(`   - ${warning}`);
            });
        }
        process.exit(0);
    } else {
        console.error('\n❌ Failed to create valid commit');
        const [reason_type, reason_details] = result[1].reason;
        
        switch (reason_type) {
            case 'structure not valid':
                console.error('\nStructure validation errors:');
                reason_details.errors.forEach((error: string) => {
                    console.error(`  - ${error}`);
                });
                break;
            case 'interface implementation mismatch':
                console.error('\nInterface/Implementation mismatch errors:');
                reason_details.errors.forEach((error: string) => {
                    console.error(`  - ${error}`);
                });
                break;
            case 'already staged':
                console.error('\nThere are already staged files. Commit or unstage them first.');
                console.error('Use --force to bypass this check.');
                break;
            case 'tests failing':
            case 'build failing':
            case 'npm install failed':
            case 'commit failed':
            case 'push failed':
                console.error(`\n${reason_type}:`);
                console.error(reason_details.details);
                break;
            case 'clean failed':
                console.error('\nClean failed:');
                reason_details.errors.forEach((error: string) => {
                    console.error(`  - ${error}`);
                });
                break;
            default:
                console.error('Unknown error:', reason_type, reason_details);
        }
        process.exit(1);
    }
}
main();
