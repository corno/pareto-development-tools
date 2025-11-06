import * as fs from 'fs';
import * as path from 'path';
import * as os from 'os';
import { execSync } from 'child_process';
import { is_node_project } from '../old_lib/is_node_project';
import { compare_with_published } from '../queries/compare_with_published';


export const $$ = (args: string[]): Promise<void> => {

    // Get package directory and flags from command line arguments
    const package_dir = args.find(arg => !arg.startsWith('-'));
    const is_verbose = args.includes('-v') || args.includes('--verbose');
    const skip_build = args.includes('--skip-build');

    if (!package_dir) {
        console.error('Usage: pareto compare <package-directory> [-v|--verbose] [--skip-build]');
        console.error('  -v, --verbose    Show detailed output');
        console.error('  --skip-build     Skip building the local package (use existing dist)');
        process.exit(1);
    }

    const package_path = path.resolve(package_dir);

    // Check if it's a valid Node.js project
    if (!is_node_project(package_path)) {
        console.error(`Error: package.json not found in ${package_path}`);
        process.exit(1);
    }

    // Try to launch Beyond Compare
    function launch_beyond_compare(dir1: string, dir2: string, options: { verbose?: boolean } = {}): boolean {
        const beyond_compare_commands = [
            'bcompare',  // Linux/macOS
            'bcomp',     // Alternative Linux command
            '/usr/bin/bcompare',  // Explicit path
            '/opt/beyondcompare/bin/bcompare'  // Alternative path
        ];

        for (const cmd of beyond_compare_commands) {
            try {
                if (options.verbose) {
                    console.log(`Attempting to launch Beyond Compare with: ${cmd}`);
                }

                execSync(`${cmd} "${dir1}" "${dir2}"`, {
                    stdio: 'pipe'
                });

                return true;
            } catch (error) {
                // Try next command
                continue;
            }
        }

        if (options.verbose) {
            console.log('Beyond Compare not found, trying generic diff viewer...');
        }

        // Fallback to other diff tools
        const fallback_commands = [
            `meld "${dir1}" "${dir2}"`,
            `kompare "${dir1}" "${dir2}"`,
            `diff -r "${dir1}" "${dir2}"`
        ];

        for (const cmd of fallback_commands) {
            try {
                execSync(cmd, {
                    stdio: 'inherit'
                });
                return true;
            } catch (error) {
                continue;
            }
        }

        return false;
    }

    console.log(`Comparing package at: ${package_path}`);
    // Use the new compare_with_published query
    const comparison_result = compare_with_published({ 'package path': package_path });

    if (comparison_result[0] === 'could not compare') {
        const [_, reason] = comparison_result;

        switch (reason[0]) {
            case 'no package json':
                console.error('❌ No package.json found in pub/ directory');
                break;
            case 'no package name':
                console.error('❌ No package name specified in package.json');
                break;
            case 'not published':
                console.error('❌ Package not found on npm registry');
                console.error('This might be a new package that hasn\'t been published yet.');
                break;
        }
        process.exit(1);
    }

    // comparison_result[0] === 'could compare'
    const [_, result] = comparison_result;

    if (result[0] === 'identical') {
        console.log('🎉 Packages are identical!');
        console.log('The local package matches the published version.');
        return;
    }

    // Packages differ - result[0] === 'different'
    const { 'path to local': local_path, 'path to published': published_path } = result[1];

    console.log('📊 Packages differ!');

    if (local_path && published_path) {
        // Try to launch Beyond Compare with the extracted packages
        const beyond_compare_launched = launch_beyond_compare(published_path, local_path, { verbose: is_verbose });

        if (beyond_compare_launched) {
            console.log('Beyond Compare launched for detailed comparison.');
            console.log(`\nTemp directory preserved: ${path.dirname(local_path)}`);
            console.log('You can manually delete it when done with Beyond Compare.');
        } else {
            console.log('Could not launch Beyond Compare or other diff tools.');

            if (is_verbose) {
                console.log(`Published package: ${published_path}`);
                console.log(`Local package: ${local_path}`);
                console.log('You can manually compare these directories.');
            }

            // Clean up temp directory since no comparison tool was launched
            const temp_dir = path.dirname(local_path);
            if (fs.existsSync(temp_dir)) {
                fs.rmSync(temp_dir, { recursive: true, force: true });
            }
        }
    } else {
        console.log('Package extraction failed, but packages are known to differ.');
    }
}