#!/usr/bin/env node

import * as fs from 'fs';
import * as path from 'path';
import * as ensureValidCommitModule from '../../lib/ensure_valid_commit';
import { analyze_dependencies, get_build_order } from '../../lib/dependency_graph_utils';

async function main(): Promise<void> {
    /**
     * Ensure Valid Commits for All Packages
     * 
     * This command runs ensure_valid_commit on all packages in a directory.
     * Processes packages in topological order (dependencies first).
     * It will validate structure, stage changes, clean, install dependencies,
     * copy templates, generate .gitignore, build, test, commit and push for each package.
     * 
     * @usage ./ensure_valid_commits.js <directory> [--force] [--no-push] [--verbose]
     */
    const args = process.argv.slice(2);
    const target_dir = args.find(arg => !arg.startsWith('-'));
    const is_force = args.includes('--force');
    const no_push = args.includes('--no-push');
    const skip_dep_upgrade = args.includes('--skip-dep-upgrade');
    const verbose = args.includes('--verbose') || args.includes('-v');
    if (!target_dir || args.includes('--help') || args.includes('-h')) {
        console.log('Usage: pareto all ensure-valid-commits <directory> [options]');
        console.log('');
        console.log('Ensures valid commits for all packages in the directory.');
        console.log('Processes packages in topological order (dependencies first).');
        console.log('');
        console.log('Options:');
        console.log('  --force              Skip validation steps (force commit)');
        console.log('  --no-push            Commit but do not push to remote');
        console.log('  --skip-dep-upgrade   Skip dependency upgrade (only install)');
        console.log('  --verbose, -v        Show verbose output');
        console.log('  --help, -h           Show this help message');
        console.log('');
        console.log('Examples:');
        console.log('  pareto all ensure-valid-commits ../my-packages');
        console.log('  pareto all ensure-valid-commits ../my-packages --no-push');
        console.log('  pareto all ensure-valid-commits ../my-packages --force --verbose');
        console.log('  pareto all ensure-valid-commits ../my-packages --skip-dep-upgrade');
        process.exit(0);
    }
    const resolved_dir = path.resolve(target_dir);
    if (!fs.existsSync(resolved_dir)) {
        console.error(`Error: Directory not found: ${resolved_dir}`);
        process.exit(1);
    }
    const tools_dir = path.resolve(__dirname, '../../../..');
    const structure_json_path = path.join(tools_dir, 'data', 'structure.json');
    if (!fs.existsSync(structure_json_path)) {
        console.error(`Error: structure.json not found at ${structure_json_path}`);
        process.exit(1);
    }
    const structure = JSON.parse(fs.readFileSync(structure_json_path, 'utf8'));
    const ensure_valid_commit = ensureValidCommitModule.$$;
    console.log(`Analyzing dependencies in: ${resolved_dir}`);
    const graph_data = analyze_dependencies(resolved_dir, true);
    if (!graph_data || !graph_data.projects || graph_data.projects.length === 0) {
        console.log('No Node.js projects found in the specified directory');
        process.exit(0);
    }
    const ordered_packages_data = get_build_order(graph_data);
    const ordered_packages = ordered_packages_data.map(pkg => ({
        name: pkg.name,
        path: pkg.path
    }));
    console.log(`Found ${ordered_packages.length} package(s)`);
    console.log(`Processing in topological order (dependencies first)\n`);
    if (is_force) {
        console.log('⚠️  FORCE mode: Skipping validation steps');
    }
    if (no_push) {
        console.log('📌 Will not push to remote');
    }
    const results = {
        success: [],
        failed: [],
        skipped: []
    };
    for (const pkg of ordered_packages) {
        console.log(`\n${'='.repeat(80)}`);
        console.log(`Processing: ${pkg.name}`);
        console.log('='.repeat(80));
        
        try {
            // Prompt function for commit message
            const prompt_for_commit_message = () => {
                
                // Write prompt to stderr
                process.stderr.write(`[${pkg.name}] Enter commit message: `);
                
                // Read synchronously from stdin
                const BUFFER_SIZE = 256;
                const buffer = Buffer.alloc(BUFFER_SIZE);
                let input = '';
                
                try {
                    const bytesRead = fs.readSync(0, buffer, 0, BUFFER_SIZE, null);
                    if (bytesRead > 0) {
                        input = buffer.toString('utf8', 0, bytesRead).trim();
                    }
                } catch (err) {
                    console.error('Failed to read input:', err.message);
                    return '';
                }
                
                return input;
            };
            
            const result = await ensure_valid_commit(pkg.path, structure, prompt_for_commit_message, {
                skip_validation: is_force,
                skip_push: no_push,
                skip_dep_upgrade: skip_dep_upgrade
            });
            
            if (result[0] === 'committed') {
                console.log(`✅ ${pkg.name}: Success`);
                if (result[1].warnings.length > 0 && verbose) {
                    console.log('⚠️  Warnings:');
                    result[1].warnings.forEach(warning => console.log(`   - ${warning}`));
                }
                results.success.push(pkg.name);
            } else {
                const [reason_type, reason_details] = result[1].reason;
                console.error(`❌ ${pkg.name}: Failed - ${reason_type}`);
                
                // Show detailed error information based on type
                if (reason_type === 'structure not valid') {
                    console.error('   Structure validation errors:');
                    (reason_details as { errors: string[] }).errors.forEach(error => console.error(`     ${error}`));
                } else if (reason_type === 'interface implementation mismatch') {
                    console.error('   Interface/Implementation mismatch:');
                    (reason_details as { errors: string[] }).errors.forEach(error => console.error(`     ${error}`));
                } else if (reason_type === 'already staged') {
                    console.error('   There are already staged files. Commit or unstage them first.');
                    console.error('   Use --force to bypass this check.');
                } else if (reason_type === 'clean failed') {
                    console.error('   Clean errors:');
                    (reason_details as { errors: string[] }).errors.forEach(error => console.error(`     ${error}`));
                } else if (reason_details && typeof reason_details === 'object' && 'details' in reason_details) {
                    console.error(`   ${(reason_details as { details: string }).details}`);
                }
                
                results.failed.push({ name: pkg.name, reason: reason_type });
                
                // Stop processing after first failure
                console.error(`\n⚠️  Stopping after first failure. Fix ${pkg.name} and run again.`);
                break;
            }
        } catch (err) {
            console.error(`❌ ${pkg.name}: Unexpected error`);
            if (verbose) {
                console.error(`   ${err.message}`);
                console.error(err.stack);
            }
            results.failed.push({ name: pkg.name, reason: 'unexpected error' });
            
            // Stop processing after first failure
            console.error(`\n⚠️  Stopping after first failure. Fix ${pkg.name} and run again.`);
            break;
        }
    }
    console.log(`\n${'='.repeat(80)}`);
    console.log('SUMMARY');
    console.log('='.repeat(80));
    console.log(`Total packages: ${ordered_packages.length}`);
    console.log(`✅ Success: ${results.success.length}`);
    console.log(`❌ Failed: ${results.failed.length}`);
    if (results.success.length > 0) {
        console.log('\nSuccessful packages (in order processed):');
        results.success.forEach(name => console.log(`  ✅ ${name}`));
    }
    if (results.failed.length > 0) {
        console.log('\nFailed packages:');
        results.failed.forEach(({ name, reason }) => console.log(`  ❌ ${name} (${reason})`));
    }
    process.exit(results.failed.length > 0 ? 1 : 0);
}

main();
