#!/usr/bin/env node

import * as fs from 'fs';
import * as path from 'path';
import * as readline from 'readline';
import { execSync, spawn } from 'child_process';
import { $$ as analyse_cluster } from '../../queries/analyse_cluster';
import { project_cluster_state_to_dot } from '../../old_lib/project_cluster_state_to_dot';
import { differs_from_published } from '../../old_lib/differs_from_published';
import type { Package_State } from '../../interface/package_state';

// Get target directory from command line argument

async function main(): Promise<void> {
    const args = process.argv.slice(2);
    const verbose = args.includes('--verbose') || args.includes('-v');
    const show_path = args.includes('--show-path') || args.includes('-p');
    const show_command = args.includes('--show-command') || args.includes('-c');
    const output_dot = args.includes('--dot');
    const dont_open_viewer = args.includes('--dont-open-viewer');
    const hide_legend = args.includes('--no-legend');
    const show_legend = !hide_legend; // Show legend by default, hide if --no-legend is specified
    const skip_publish_compare = args.includes('--skip-publish-compare');
    const output_svg = !output_dot; // SVG is default
    const auto_open = output_svg && !dont_open_viewer && !show_path && !show_command; // Auto-open SVG unless disabled
    const positional_args = args.filter(arg => !arg.startsWith('--') && !arg.startsWith('-'));
    const target_dir = positional_args[0];
    let output_file: string;
    if (positional_args.length === 1) {
        output_file = output_svg ? 'dependencies.svg' : 'dependencies.dot';
    } else {
        output_file = positional_args[1];
    }
    if (!target_dir || args.includes('--help') || args.includes('-h')) {
        console.log('Usage: dependency-graph <directory> [output_file] [options]');
        console.log('');
        console.log('Generates an SVG dependency graph by default and opens it automatically.');
        console.log('');
        console.log('Options:');
        console.log('  --verbose, -v            Show verbose output');
        console.log('  --dot                    Output DOT format instead of SVG (no auto-open)');
        console.log('  --dont-open-viewer       Generate SVG but don\'t open it automatically');
        console.log('  --no-legend              Hide legend from the graph (legend shown by default)');
        console.log('  --skip-publish-compare   Skip checking if packages are in sync with published versions');
        console.log('  --show-path, -p          Show file path after generation (disables auto-open)');
        console.log('  --show-command, -c       Show command to open it (disables auto-open)');
        console.log('  --help, -h               Show this help message');
        console.log('');
        console.log('Examples:');
        console.log('  dependency-graph ../my-repos');
        console.log('  dependency-graph ../my-repos deps.svg --verbose');
        console.log('  dependency-graph ../my-repos deps.dot --dot');

        if (!target_dir) {
            process.exit(1);
        } else {
            process.exit(0);
        }
    }
    const base_dir = path.resolve(target_dir);
    if (!fs.existsSync(base_dir)) {
        console.error(`Error: Directory ${target_dir} does not exist`);
        process.exit(1);
    }

    // Early prompts to let user choose what work to do
    const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout
    });

    let shouldAnalyze = true;
    let shouldComparePublished = false;

    if (!skip_publish_compare) {
        // Ask about analysis first
        shouldAnalyze = await new Promise<boolean>((resolve) => {
            rl.question('🔍 Do you want to analyze package states (build and test)? This may be slow. (Y/n): ', (answer) => {
                const normalizedAnswer = answer.toLowerCase().trim();
                resolve(normalizedAnswer !== 'n' && normalizedAnswer !== 'no');
            });
        });

        if (shouldAnalyze) {
            // Ask about published comparison
            shouldComparePublished = await new Promise<boolean>((resolve) => {
                rl.question('📦 Do you want to compare against published versions? This may also be slow. (y/N): ', (answer) => {
                    const normalizedAnswer = answer.toLowerCase().trim();
                    resolve(normalizedAnswer === 'y' || normalizedAnswer === 'yes');
                });
            });
        }
    }

    rl.close();

    // First, do a quick scan to list packages
    console.log(`\nScanning for packages in ${target_dir}...`);
    const subdirs = fs.readdirSync(base_dir, { withFileTypes: true })
        .filter(dirent => dirent.isDirectory())
        .map(dirent => dirent.name)
        .filter(name => !name.startsWith('.'));

    const quick_package_list = [];
    for (const subdir of subdirs) {
        const package_json_path = path.join(base_dir, subdir, 'pub', 'package.json');
        if (fs.existsSync(package_json_path)) {
            try {
                const package_json = JSON.parse(fs.readFileSync(package_json_path, 'utf8'));
                quick_package_list.push({
                    name: subdir,
                    package_name: package_json.name,
                    version: package_json.version || null
                });
            } catch (err) {
                // Skip invalid package.json files
            }
        }
    }

    if (quick_package_list.length === 0) {
        console.error('No packages found in the specified directory');
        process.exit(1);
    }

    const get_relative_path = (absolute_path: string) => {
        const rel = path.relative(process.cwd(), absolute_path);
        return rel.startsWith('..') || rel.startsWith('.') ? rel : './' + rel;
    };

    console.log(`\nFound ${quick_package_list.length} packages:`);
    for (const pkg of quick_package_list) {
        const package_path = path.join(base_dir, pkg.name);
        const name_mismatch = pkg.name !== pkg.package_name;
        const warning = name_mismatch ? ' ⚠️  (name mismatch)' : '';
        const version_display = pkg.version !== null ? pkg.version : 'n/a';
        console.log(`  - ${get_relative_path(package_path)} (${pkg.package_name}@${version_display})${warning}`);
        if (name_mismatch && verbose) {
            console.log(`    ⚠️  Warning: Package name '${pkg.package_name}' doesn't match directory name '${pkg.name}'`);
        }
    }

    let cluster_state;
    let package_names;

    if (shouldAnalyze) {
        // Now do the heavy analysis (build/test plus dependency analysis)
        console.log(`\n🔍 Analyzing package states (build, test, and dependencies)...`);
        console.log('This may take a while as each package will be built and tested.');
        const cluster_result = analyse_cluster({
            'cluster path': base_dir,
            'build and test': true,
            'compare to published': shouldComparePublished,

        });

        if (cluster_result[0] === 'not found') {
            console.error('Error: Cluster not found');
            process.exit(1);
        }

        cluster_state = cluster_result;
        const cluster_data = cluster_result[1];

        package_names = Object.keys(cluster_data.projects).filter(name =>
            cluster_data.projects[name][0] === 'project'
        );
        if (package_names.length === 0) {
            console.error('Error: No valid packages found after analysis');
            process.exit(1);
        }

        console.log(`✅ Analysis complete. ${package_names.length} packages successfully analyzed.`);
    } else {
        console.log(`\n⏭️  Skipping detailed analysis (user choice)`);
        // Create minimal cluster state for graph generation with basic dependency info
        package_names = quick_package_list.map(pkg => pkg.name);
        const projects_data: { [name: string]: ['not a project', null] | ['project', Package_State] } = {};

        // Get basic dependency info from package.json files (fast)
        for (const pkg of quick_package_list) {
            const package_json_path = path.join(base_dir, pkg.name, 'pub', 'package.json');
            let dependencies = {};

            if (fs.existsSync(package_json_path)) {
                try {
                    const package_json = JSON.parse(fs.readFileSync(package_json_path, 'utf8'));
                    const all_deps = package_json.dependencies || {};

                    for (const [dep_name, dep_version] of Object.entries(all_deps)) {
                        const version_string = dep_version as string;

                        // Check if it's a sibling dependency (in the same cluster)
                        const sibling_pkg = quick_package_list.find(p => p.package_name === dep_name);

                        let target_status: Package_State['dependencies'][string]['target'];

                        if (sibling_pkg) {
                            // For sibling dependencies, check if versions match
                            const clean_required = version_string.replace(/[\^~>=<]/g, '');
                            const sibling_version = sibling_pkg.version !== null ? sibling_pkg.version : 'n/a';
                            const is_up_to_date = sibling_version === clean_required;

                            target_status = ['found', { 'dependency up to date': is_up_to_date }];
                        } else {
                            // External dependencies are marked as 'not found' (not in cluster)
                            target_status = ['not found', null];
                        }

                        dependencies[dep_name] = {
                            version: version_string,
                            target: target_status
                        };
                    }
                } catch (err) {
                    // Skip invalid package.json
                }
            }

            // Check git status for this package
            const git_status = (() => {
                try {
                    const pkg_path = path.join(base_dir, pkg.name);

                    // Check for dirty working tree
                    const status_output = execSync('git status --porcelain', {
                        cwd: pkg_path,
                        encoding: 'utf8',
                        stdio: 'pipe'
                    }).trim();
                    const dirty_working_tree = status_output.length > 0;

                    // Check for staged files
                    const staged_output = execSync('git diff --cached --name-only', {
                        cwd: pkg_path,
                        encoding: 'utf8',
                        stdio: 'pipe'
                    }).trim();
                    const staged_files = staged_output.length > 0;

                    // Check for unpushed commits
                    let unpushed_commits = false;
                    try {
                        const unpushed_output = execSync('git log @{u}.. --oneline', {
                            cwd: pkg_path,
                            encoding: 'utf8',
                            stdio: 'pipe'
                        }).trim();
                        unpushed_commits = unpushed_output.length > 0;
                    } catch {
                        // No upstream branch or other error - assume no unpushed commits
                        unpushed_commits = false;
                    }

                    return {
                        'staged files': staged_files,
                        'dirty working tree': dirty_working_tree,
                        'unpushed commits': unpushed_commits
                    };
                } catch {
                    // If any git command fails, return all false
                    return {
                        'staged files': false,
                        'dirty working tree': false,
                        'unpushed commits': false
                    };
                }
            })();

            projects_data[pkg.name] = ['project', {
                'package name in package.json': pkg.package_name,
                'version': pkg.version,
                'git': git_status,
                'structure': ['valid', { 'warnings': [] }],
                'test': ['skipped', null],
                'dependencies': dependencies,
                'published comparison': ['skipped', null]
            }];
        }

        // Wrap in tagged union
        cluster_state = ['cluster', {
            projects: projects_data,
            'topological order': ['valid order', package_names]
        }];
    }
    const publish_sync_status = new Map<string, boolean>();

    if (shouldComparePublished && !skip_publish_compare) {
        console.log('\n🔍 Checking sync status with published versions...');
        console.log('This may take a while as each package will be compared against npm registry.');

        for (const package_name of package_names) {
            const package_path = path.join(base_dir, package_name);
            process.stdout.write(`  Checking ${package_name}... `);
            try {
                const differs = differs_from_published(package_path);
                publish_sync_status.set(package_name, !differs); // in_sync = !differs
                console.log(differs ? '📤 differs' : '✅ in sync');
            } catch (err: any) {
                console.log(`❌ error: ${err.message}`);
                publish_sync_status.set(package_name, false); // Assume differs on error
            }
        }

        const in_sync_count = Array.from(publish_sync_status.values()).filter(sync => sync).length;
        const out_of_sync_count = publish_sync_status.size - in_sync_count;
        console.log(`\n📊 Publish sync check complete: ${in_sync_count} in sync, ${out_of_sync_count} out of sync`);
    } else {
        const reason = skip_publish_compare ? 'flag used' : 'user choice';
        console.log(`\n⏭️  Skipping publish sync check (${reason})`);
        // Set all to true (assume in sync when skipped)
        for (const package_name of package_names) {
            publish_sync_status.set(package_name, true);
        }
    }
    const dot_content = project_cluster_state_to_dot(
        cluster_state,
        {
            include_legend: show_legend,
            cluster_path: base_dir,
            show_warnings: verbose,
            'time stamp': new Date().toISOString()
        }
    );
    const output_path = path.resolve(output_file);
    if (output_svg) {
        // Generate SVG directly using GraphViz
        try {
            // Check if dot command is available
            try {
                execSync('which dot', { stdio: 'pipe' });
            } catch {
                console.error('❌ Error: GraphViz (dot command) not found. Please install GraphViz first.');
                console.error('On Ubuntu/Debian: sudo apt-get install graphviz');
                console.error('On CentOS/RHEL: sudo yum install graphviz');
                console.error('On macOS: brew install graphviz');
                process.exit(1);
            }

            // Create a temporary DOT file for processing
            const temp_dot_file = `/tmp/temp-${Date.now()}.dot`;
            fs.writeFileSync(temp_dot_file, dot_content);

            // Generate SVG from DOT
            execSync(`dot -Tsvg ${temp_dot_file} -o ${output_path}`, { stdio: 'pipe' });

            // Clean up temporary DOT file
            fs.unlinkSync(temp_dot_file);

            console.log(`\nDependency graph generated as SVG: ${output_path}`);
        } catch (err: any) {
            console.error(`❌ Error generating SVG:`, err.message);
            console.error('Falling back to DOT format...');
            fs.writeFileSync(output_path, dot_content);
            console.log(`\nDependency graph generated as DOT: ${output_path}`);
            console.log(`\nTo generate SVG manually, run:`);
            console.log(`  dot -Tsvg ${path.basename(output_file)} -o ${path.basename(output_file, '.svg')}.svg`);
        }
    } else {
        // Write DOT file
        fs.writeFileSync(output_path, dot_content);
        console.log(`\nDependency graph generated: ${output_path}`);
        console.log(`\nTo generate an image, run one of:`);
        console.log(`  dot -Tpng ${path.basename(output_file)} -o dependencies.png`);
        console.log(`  dot -Tsvg ${path.basename(output_file)} -o dependencies.svg`);
        console.log(`  dot -Tpdf ${path.basename(output_file)} -o dependencies.pdf`);
    }
    const total_deps = package_names.reduce((sum, name) => {
        const project_entry = cluster_state.projects[name];
        if (project_entry && project_entry[0] === 'project') {
            return sum + Object.keys(project_entry[1].dependencies).length;
        }
        return sum;
    }, 0);
    const sibling_deps = package_names.reduce((sum, name) => {
        const project_entry = cluster_state.projects[name];
        if (project_entry && project_entry[0] === 'project') {
            const project_deps = Object.keys(project_entry[1].dependencies);
            return sum + project_deps.filter(dep => package_names.includes(dep)).length;
        }
        return sum;
    }, 0);
    const external_deps = new Set<string>();
    package_names.forEach(name => {
        const project_entry = cluster_state.projects[name];
        if (project_entry && project_entry[0] === 'project') {
            Object.keys(project_entry[1].dependencies).forEach(dep => {
                if (!package_names.includes(dep)) {
                    external_deps.add(dep);
                }
            });
        }
    });
    console.log(`\nSummary:`);
    console.log(`  - ${package_names.length} packages`);
    console.log(`  - ${external_deps.size} external dependencies`);
    console.log(`  - ${total_deps} total dependency relationships`);
    console.log(`  - ${sibling_deps} sibling dependencies`);
    console.log(`  - ${total_deps - sibling_deps} external dependencies`);
    if (!skip_publish_compare) {
        const in_sync_count = Array.from(publish_sync_status.values()).filter(sync => sync).length;
        const out_of_sync_count = publish_sync_status.size - in_sync_count;
        console.log(`  - ${in_sync_count} packages in sync with published versions`);
        console.log(`  - ${out_of_sync_count} packages out of sync with published versions`);
    } else {
        console.log(`  - Publish sync check skipped`);
    }
    if (auto_open) {
        console.log(`\nOpening dependency graph...`);

        try {
            // Try to open the file
            let open_command: string;
            const platform = process.platform;

            if (platform === 'darwin') {
                open_command = 'open';
            } else if (platform === 'win32') {
                open_command = 'start';
            } else {
                // For Linux and other Unix-like systems
                // Try different viewers in order of preference
                const linux_viewers = ['feh', 'eog', 'xviewer', 'gpicview'];
                let viewer_found = false;

                for (const viewer of linux_viewers) {
                    try {
                        execSync(`which ${viewer}`, { stdio: 'pipe' });
                        open_command = viewer;
                        viewer_found = true;
                        break;
                    } catch {
                        // Viewer not found, try next one
                    }
                }

                if (!viewer_found) {
                    open_command = 'xdg-open';
                }
            }

            try {
                // For Linux, try to use the selected viewer first, fallback to xdg-open
                if (platform === 'linux') {
                    try {
                        // Try the selected viewer directly with clean environment
                        const cleanEnv = Object.assign({}, process.env);
                        delete cleanEnv.LD_LIBRARY_PATH;

                        const proc = spawn(open_command, [output_path], {
                            detached: true,
                            stdio: 'ignore',
                            env: cleanEnv
                        });
                        proc.unref();

                        console.log(`✓ Opened with ${open_command}`);
                    } catch (viewerError: any) {
                        // If the selected viewer fails, fallback to xdg-open
                        try {
                            const cleanEnv = Object.assign({}, process.env);
                            delete cleanEnv.LD_LIBRARY_PATH;

                            const proc = spawn('xdg-open', [output_path], {
                                detached: true,
                                stdio: 'ignore',
                                env: cleanEnv
                            });
                            proc.unref();

                            console.log(`✓ Opened with xdg-open (fallback)`);
                        } catch (xdgError: any) {
                            console.log(`❌ Could not open automatically: ${xdgError.message}`);
                            console.log(`📁 SVG file created at: ${output_path}`);
                            console.log(`You can open it manually.`);
                        }
                    }
                } else {
                    // For macOS and Windows, use the original approach
                    execSync(`${open_command} "${output_path}"`, { stdio: 'ignore' });
                    console.log(`✓ Opened in default viewer`);
                }
            } catch (openError: any) {
                console.error(`❌ Failed to open:`, openError.message);
                console.log(`📁 SVG file created at: ${output_path}`);
                console.log(`You can open it manually with your preferred viewer.`);
            }

        } catch (err: any) {
            console.error(`❌ Error opening SVG:`, err.message);
        }
    } else if (output_svg && (show_path || show_command || dont_open_viewer)) {
        if (show_path || dont_open_viewer) {
            console.log(`\n📁 SVG file created at: ${output_path}`);
            if (!show_command) {
                console.log(`You can open it with your preferred viewer.`);
            }
        }

        if (show_command) {
            console.log(`\n📁 SVG file created at: ${output_path}`);
            console.log(`\nTo open it, run one of these commands:`);
            console.log(`  firefox "${output_path}"`);
            console.log(`  google-chrome "${output_path}"`);
            console.log(`  eog "${output_path}"`);
            console.log(`  xdg-open "${output_path}"`);
        }
    }
}

main();
