#!/usr/bin/env node
/**
 * Package Publishing Script
 * 
 * This script publishes a Node.js package through a comprehensive validation and build pipeline.
 * 
 * PUBLISHING FLOW:
 * ================
 * 
 * 1. ENSURE VALID COMMIT
 *    - See ensure_valid_commit.ts for complete workflow details
 *    - Validates structure, stages changes, cleans, installs dependencies
 *    - Copies templates (tsconfig, index.ts), generates .gitignore
 *    - Builds, tests, commits and pushes
 *    - Prompts for commit message only if changes exist
 * 
 * 2. EVALUATE CHANGES
 *    - Compare local package with published version
 *    - Option to launch Beyond Compare for visual diff
 *    - Warn if no changes detected
 * 
 * 3. VERSION INCREMENT
 *    - Run npm version patch (increments patch version)
 *    - Creates git commit and tag automatically
 *    - Push commit and tag to remote
 * 
 * 4. PUBLISH
 *    - Publish to npm registry
 *    - Uses credentials from npm config
 * 
 * IMPORTANT NOTES:
 * ================
 * - ensure_valid_commit handles all validation, building, testing, and committing
 * - The script fails fast at any error
 * 
 * DRY RUN MODE:
 * =============
 * Use --dry-run flag to perform all steps except:
 * - Actual git commits/pushes (via ensure_valid_commit)
 * - npm version increment
 * - npm publish
 * 
 * @usage ./publish.js <package-directory> [--dry-run]
 */

import { execSync } from 'child_process';
import * as fs from 'fs';
import * as path from 'path';
import * as readline from 'readline';
import * as ensureValidCommitModule from '../old_lib/ensure_valid_commit';
const ensure_valid_commit = ensureValidCommitModule.$$;
import * as compareWithPublishedModule from '../old_lib/compare_with_published';
const compare_with_published = compareWithPublishedModule.$$;

// Helper function to prompt user for input
function prompt_user(question: string): Promise<string> {
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

// Get package directory and flags from command line arguments
const args = process.argv.slice(2);
const package_dir = args.find(arg => !arg.startsWith('-'));
const is_dry_run = args.includes('-d') || args.includes('--dry-run');
const is_raw = args.includes('--raw');

if (!package_dir) {
    console.error('Usage: publish.js <package-directory> [-d|--dry-run] [--raw]');
    console.error('  -d, --dry-run    Perform all steps except actual npm publish');
    console.error('  --raw            Output structured JSON result');
    process.exit(1);
}

const package_path = path.resolve(package_dir);
const package_json_path = path.join(package_path, 'pub', 'package.json');

// Check if package.json exists
if (!fs.existsSync(package_json_path)) {
    console.error(`Error: package.json not found in ${package_path}/pub`);
    process.exit(1);
}

const package_name = path.basename(package_path);

// Helper function to output failure and exit
function failure_exit(result) {
    if (is_raw) {
        console.error(JSON.stringify(result, null, 2));
    } else {
        // Write error messages based on the tag
        const tag = result[0];
        switch (tag) {
            case 'structure-not-found':
                console.error('❌ Error: structure.json not found at', result[1]);
                break;
            case 'structure-validation-errors':
                console.error('❌ Structure validation failed:');
                result[1].forEach(issue => {
                    console.error(`   - ${issue[1][1]}`);
                });
                break;
            case 'structure-validation-error':
                console.error('❌ Structure validation failed:', result[1]);
                break;
            case 'uncommitted-changes-refused':
                console.error('❌ Cannot publish with uncommitted changes. Please commit or stash changes first.');
                break;
            case 'uncommitted-changes-not-committed':
                console.error('❌ Cannot publish with uncommitted changes. Please commit or stash changes first.');
                break;
            case 'empty-commit-message':
                console.error('❌ Commit message cannot be empty');
                break;
            case 'cleaning-failed':
                console.error('❌ Error: Cleaning operations failed:');
                result[1].forEach(error => console.error(`  ${error}`));
                break;
            case 'dependency-update-failed':
                console.error('❌ Error: Failed to update dependencies');
                console.error(result[1]);
                break;
            case 'template-not-found':
                console.error(`❌ Error: ${result[1]} template not found at`, result[2]);
                break;
            case 'unexpected-error':
                console.error(`\n❌ Failed to ${is_dry_run ? 'dry run' : 'publish'} ${package_name}:`);
                console.error(result[1]);
                break;
        }
    }
    process.exit(1);
}

console.log(`${is_dry_run ? 'DRY RUN: ' : ''}Publishing package: ${package_name}`);
console.log(`Package path: ${package_path}`);
if (is_dry_run) {
    console.log('🔍 DRY RUN MODE: Will perform all steps except actual npm publish');
}

async function main() {
try {
    const tools_dir = path.resolve(__dirname, '../../..');
    const structure_json_path = path.join(tools_dir, 'data', 'structure.json');
    
    if (!fs.existsSync(structure_json_path)) {
        failure_exit(['structure-not-found', structure_json_path]);
    }
    
    const structure = JSON.parse(fs.readFileSync(structure_json_path, 'utf8'));
    
    // Step 1: Ensure valid commit
    console.log('\n1. Ensuring valid commit...');
    const ensure_result = ensure_valid_commit(package_path, structure, () => {
        // Prompt for commit message synchronously using fs.readSync
        process.stdout.write('Enter commit message: ');
        const buffer = Buffer.alloc(1024);
        const bytesRead = fs.readSync(process.stdin.fd, buffer, 0, 1024, null);
        const commit_message = buffer.toString('utf8', 0, bytesRead).trim();
        return commit_message;
    }, {
        skip_validation: false,
        skip_push: is_dry_run,
        skip_dep_upgrade: false  // Always update dependencies before publishing
    });
    
    if (ensure_result[0] !== 'committed') {
        const [reason_type, reason_details] = ensure_result[1].reason;
        console.error('\n❌ Failed to ensure valid commit');
        console.error(`Reason: ${reason_type}`);
        if (reason_type === 'structure not valid') {
            console.error('Structure validation errors:');
            (reason_details as { errors: string[] }).errors.forEach(error => console.error(`   - ${error}`));
        } else if (reason_details && typeof reason_details === 'object' && 'details' in reason_details) {
            console.error((reason_details as { details: string }).details);
        }
        process.exit(1);
    }
    
    console.log('✓ Valid commit ensured');
    if (ensure_result[1].warnings.length > 0) {
        console.log('⚠️  Warnings:');
        ensure_result[1].warnings.forEach(warning => console.log(`   - ${warning}`));
    }

    // Step 2: Compare with published version
    console.log('\n2. Comparing with published version...');
    const compare_result = await compare_with_published(package_path, prompt_user, {
        verbose: false,
        launch_beyond_compare: true
    });
    
    if (compare_result[0] === 'cancelled') {
        console.log('Publishing cancelled by user');
        process.exit(0);
    } else if (compare_result[0] === 'error') {
        console.error('❌ Failed to compare with published version:', compare_result[1].details);
        process.exit(1);
    } else {
        console.log('✓', compare_result[1].message);
    }

    // Step 3: Increment version (patch)
    console.log('\n3. Incrementing version...');
    if (is_dry_run) {
        console.log('🔍 DRY RUN: Would run npm version patch');
        console.log('✓ Version increment skipped (dry run)');
    } else {
        // Run npm version patch - this modifies package.json and package-lock.json
        execSync('npm version patch --git-tag-version=false', { cwd: path.join(package_path, 'pub'), stdio: 'inherit' });
        console.log('✓ Version incremented');
        
        // Commit the version changes at the repository root
        console.log('Committing version changes...');
        execSync('git add pub/package.json pub/package-lock.json', { cwd: package_path, stdio: 'inherit' });
        
        // Get the new version from package.json
        const new_package_json = JSON.parse(fs.readFileSync(package_json_path, 'utf8'));
        const new_version = new_package_json.version;
        
        execSync(`git commit -m "${new_version}"`, { cwd: package_path, stdio: 'inherit' });
        execSync(`git tag v${new_version}`, { cwd: package_path, stdio: 'inherit' });
        console.log(`✓ Version ${new_version} committed and tagged`);
        
        // Push the version commit and tag
        console.log('Pushing version commit and tag...');
        execSync('git push', { cwd: package_path, stdio: 'inherit' });
        execSync('git push --tags', { cwd: package_path, stdio: 'inherit' });
        console.log('✓ Version commit and tag pushed');
    }

    // Step 4: Publish
    console.log('\n4. Publishing to npm...');
    if (is_dry_run) {
        console.log('🔍 DRY RUN: Would run npm publish');
        console.log('✓ Publish skipped (dry run)');
    } else {
        execSync('npm publish', { cwd: path.join(package_path, 'pub'), stdio: 'inherit' });
        console.log('✓ Package published successfully');
    }

    // Success!
    if (is_raw) {
        console.log(JSON.stringify(['success', package_name, is_dry_run], null, 2));
    } else {
        console.log(`\n🎉 ${is_dry_run ? 'DRY RUN completed' : 'Successfully published'} ${package_name}!${is_dry_run ? ' (No actual changes made)' : ''}`);
    }
    process.exit(0);

} catch (err) {
    failure_exit(['unexpected-error', err.message, err.stack]);
}
}

main();