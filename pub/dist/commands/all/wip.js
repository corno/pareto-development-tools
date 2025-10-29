#!/usr/bin/env node
const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');
const { is_node_project } = require('../../lib/build_test_utils');
const { extract_local, extract_published } = require('../../lib/package_compare_utils');
// Get target directory and flags from command line arguments
const args = process.argv.slice(2);
const target_dir = args.find(arg => !arg.startsWith('-'));
const is_verbose = args.includes('-v') || args.includes('--verbose');
const skip_build = args.includes('--skip-build');
const include_dev_deps = args.includes('--include-dev') || args.includes('-d');
const publish_mode = args.includes('--publish') || args.includes('-p');
if (!target_dir || args.includes('--help') || args.includes('-h')) {
    console.log('Usage: pareto all wip <directory> [options]');
    console.log('');
    console.log('Lists packages that either deviate from published versions or have lagging dependencies,');
    console.log('sorted in topological order (dependencies first).');
    console.log('');
    console.log('Options:');
    console.log('  -v, --verbose        Show detailed output');
    console.log('  --skip-build         Skip building packages (use existing dist)');
    console.log('  -d, --include-dev    Include devDependencies in dependency analysis');
    console.log('  -p, --publish        Publishing mode: ask to publish each problematic package');
    console.log('  -h, --help           Show this help message');
    console.log('');
    console.log('Examples:');
    console.log('  list_problem_packages.js ../my-repos');
    console.log('  list_problem_packages.js ../my-repos --verbose --include-dev');
    console.log('  list_problem_packages.js ../my-repos --publish');
    if (!target_dir) {
        process.exit(1);
    }
    else {
        process.exit(0);
    }
}
const base_dir = path.resolve(target_dir);
if (!fs.existsSync(base_dir)) {
    console.error(`Error: Directory ${target_dir} does not exist`);
    process.exit(1);
}
// Helper to get relative path for display
const get_relative_path = (absolute_path) => {
    const rel = path.relative(process.cwd(), absolute_path);
    return rel.startsWith('..') || rel.startsWith('.') ? rel : './' + rel;
};
/**
 * Read package.json and extract dependencies
 * @param {string} project_path - Path to the project directory
 * @param {boolean} include_dev_deps - Whether to include devDependencies
 * @returns {object} - Object containing project info and dependencies
 */
function get_project_dependencies(project_path, include_dev_deps = false) {
    const package_json_path = path.join(project_path, 'pub', 'package.json');
    try {
        const package_json = JSON.parse(fs.readFileSync(package_json_path, 'utf8'));
        const dependencies = {
            ...package_json.dependencies || {}
        };
        if (include_dev_deps) {
            Object.assign(dependencies, package_json.devDependencies || {});
        }
        return {
            name: package_json.name || path.basename(project_path),
            version: package_json.version || '0.0.0',
            dependencies: dependencies,
            prod_deps: Object.keys(package_json.dependencies || {}),
            dev_deps: Object.keys(package_json.devDependencies || {})
        };
    }
    catch (err) {
        console.error(`Error reading package.json in ${project_path}/pub:`, err.message);
        return {
            name: path.basename(project_path),
            version: '0.0.0',
            dependencies: {},
            prod_deps: [],
            dev_deps: []
        };
    }
}
/**
 * Check if a package deviates from its published version
 * @param {string} project_path - Path to the project directory
 * @param {string} package_name - Name of the package
 * @param {object} options - Options for checking
 * @returns {Promise<object>} - Result object with deviation status
 */
async function check_package_deviation(project_path, package_name, options = {}) {
    const { verbose = false, skip_build = false } = options;
    const result = {
        package_name,
        deviates: false,
        error: null,
        published_exists: false,
        build_failed: false
    };
    try {
        const temp_dir = fs.mkdtempSync(path.join(require('os').tmpdir(), `check-${package_name.replace(/[^a-zA-Z0-9]/g, '_')}-`));
        const published_dir = path.join(temp_dir, 'published');
        const local_dir = path.join(temp_dir, 'local');
        try {
            // Extract published package
            const published_result = extract_published(package_name, published_dir, { verbose });
            if (published_result.error) {
                result.error = published_result.error;
                return result;
            }
            if (!published_result.package_exists) {
                // Package not published yet - consider it as deviating
                result.deviates = true;
                result.published_exists = false;
                return result;
            }
            result.published_exists = true;
            // Extract local package
            const local_result = extract_local(project_path, local_dir, { verbose, skip_build });
            if (local_result.error) {
                result.error = local_result.error;
                return result;
            }
            if (local_result.build_failed) {
                result.build_failed = true;
                result.deviates = true; // Build failure means it deviates
                return result;
            }
            // Compare the directories using diff
            try {
                execSync(`diff -r "${published_dir}" "${local_dir}"`, {
                    stdio: 'pipe'
                });
                result.deviates = false; // Identical
            }
            catch (err) {
                result.deviates = true; // Different
            }
        }
        finally {
            // Clean up temp directory
            if (fs.existsSync(temp_dir)) {
                fs.rmSync(temp_dir, { recursive: true, force: true });
            }
        }
    }
    catch (err) {
        result.error = err.message;
    }
    return result;
}
/**
 * Determine which packages are safe to publish without creating recursive dependency issues
 * @param {Array} sorted_problem_packages - Topologically sorted problem packages
 * @param {Array} projects - All projects
 * @param {Set} sibling_projects - Set of sibling project names
 * @param {Map} project_versions - Map of project names to their versions
 * @param {Set} packages_with_deviations - Packages that deviate from published
 * @param {Set} packages_with_lagging_deps - Packages with lagging dependencies
 * @returns {Set} - Set of package names that are safe to publish
 */
function get_safe_to_publish_packages(sorted_problem_packages, projects, sibling_projects, project_versions, packages_with_deviations, packages_with_lagging_deps) {
    const safe_packages = new Set();
    const dependency_graph = new Map();
    const reverse_dependency_graph = new Map();
    // Build dependency graphs
    projects.forEach(project => {
        dependency_graph.set(project.name, []);
        reverse_dependency_graph.set(project.name, []);
    });
    projects.forEach(project => {
        Object.keys(project.dependencies).forEach(dep => {
            if (sibling_projects.has(dep)) {
                dependency_graph.get(project.name).push(dep);
                reverse_dependency_graph.get(dep).push(project.name);
            }
        });
    });
    // For each problem package, check if publishing it would create new problems
    sorted_problem_packages.forEach(package_name => {
        // Consider packages that have deviations OR lagging dependencies (both need publishing)
        const needs_publishing = packages_with_deviations.has(package_name) || packages_with_lagging_deps.has(package_name);
        if (!needs_publishing) {
            return;
        }
        const dependents = reverse_dependency_graph.get(package_name) || [];
        let is_safe = true;
        // Check if any dependent would become problematic if we publish this package
        dependents.forEach(dependent => {
            // Skip if the dependent is already a problem package
            if (sorted_problem_packages.includes(dependent)) {
                return;
            }
            // Check if this dependent currently has the correct version dependency
            const dependent_project = projects.find(p => p.name === dependent);
            const required_version = dependent_project.dependencies[package_name];
            if (required_version) {
                const clean_required_version = required_version.replace(/[\^~>=<]/g, '');
                const current_version = project_versions.get(package_name);
                // If the dependent currently requires the correct version, 
                // publishing would make it lag behind
                if (clean_required_version === current_version) {
                    is_safe = false;
                    if (is_verbose) {
                        console.log(`   ⚠️  Publishing ${package_name} would make ${dependent} lag behind`);
                    }
                }
            }
        });
        if (is_safe) {
            safe_packages.add(package_name);
        }
    });
    return safe_packages;
}
/**
 * Perform topological sort on packages based on their dependencies
 * @param {Array} packages - Array of package objects with dependencies
 * @param {Set} sibling_projects - Set of sibling project names
 * @returns {Array} - Topologically sorted array of package names
 */
function topological_sort(packages, sibling_projects) {
    const graph = new Map();
    const in_degree = new Map();
    // Initialize graph and in-degree counters
    packages.forEach(pkg => {
        graph.set(pkg.name, []);
        in_degree.set(pkg.name, 0);
    });
    // Build the dependency graph (only for sibling dependencies)
    packages.forEach(pkg => {
        Object.keys(pkg.dependencies).forEach(dep => {
            if (sibling_projects.has(dep)) {
                // dep -> pkg (dep is a dependency of pkg)
                if (graph.has(dep)) {
                    graph.get(dep).push(pkg.name);
                    in_degree.set(pkg.name, in_degree.get(pkg.name) + 1);
                }
            }
        });
    });
    // Kahn's algorithm for topological sorting
    const queue = [];
    const result = [];
    // Find nodes with no incoming edges (no dependencies)
    for (const [node, degree] of in_degree) {
        if (degree === 0) {
            queue.push(node);
        }
    }
    while (queue.length > 0) {
        const current = queue.shift();
        result.push(current);
        // Remove edges from current node
        if (graph.has(current)) {
            graph.get(current).forEach(neighbor => {
                in_degree.set(neighbor, in_degree.get(neighbor) - 1);
                if (in_degree.get(neighbor) === 0) {
                    queue.push(neighbor);
                }
            });
        }
    }
    // Check for cycles (shouldn't happen in well-formed dependency graphs)
    if (result.length !== packages.length) {
        console.warn('⚠️  Warning: Circular dependencies detected, falling back to alphabetical sort');
        return packages.map(p => p.name).sort();
    }
    return result;
}
console.log(`Analyzing packages in ${get_relative_path(base_dir)}...`);
if (is_verbose) {
    console.log(`Include dev dependencies: ${include_dev_deps}`);
    console.log(`Skip build: ${skip_build}`);
}
async function main() {
    // Get all subdirectories that contain Node.js projects
    const projects = fs.readdirSync(base_dir, { withFileTypes: true })
        .filter(dirent => dirent.isDirectory())
        .map(dirent => {
        const dir_path = path.join(base_dir, dirent.name);
        if (is_node_project(dir_path)) {
            return {
                dir_name: dirent.name,
                path: dir_path,
                ...get_project_dependencies(dir_path, include_dev_deps)
            };
        }
        return null;
    })
        .filter(project => project !== null);
    if (projects.length === 0) {
        console.error('No Node.js projects found in the specified directory');
        process.exit(1);
    }
    console.log(`Found ${projects.length} projects`);
    if (is_verbose) {
        projects.forEach(project => {
            console.log(`  - ${get_relative_path(project.path)}`);
        });
    }
    // Check for package name vs directory name mismatches
    const name_mismatches = [];
    projects.forEach(project => {
        if (project.name !== project.dir_name) {
            name_mismatches.push({
                package_name: project.name,
                dir_name: project.dir_name,
                path: project.path
            });
        }
    });
    if (name_mismatches.length > 0) {
        console.log('\n⚠️  PACKAGE NAME MISMATCHES:');
        console.log('═'.repeat(60));
        name_mismatches.forEach(mismatch => {
            console.log(`❌ ${mismatch.package_name}`);
            console.log(`   Directory: ${mismatch.dir_name}`);
            console.log(`   Path: ${get_relative_path(mismatch.path)}`);
            console.log(`   Issue: Package name '${mismatch.package_name}' doesn't match directory name '${mismatch.dir_name}'`);
        });
        console.log('');
        console.log('🔧 Fix: Rename the directory to match the package name, or update package.json name field.');
        console.log('');
    }
    // Create a set of all sibling project names for quick lookup
    const sibling_projects = new Set(projects.map(p => p.name));
    // Create a map of project names to their versions for version comparison
    const project_versions = new Map(projects.map(p => [p.name, p.version]));
    console.log('\n🔍 Checking for package deviations...');
    // Check each package for deviations from published version
    const deviation_checks = [];
    for (const project of projects) {
        if (is_verbose) {
            console.log(`Checking ${get_relative_path(project.path)}...`);
        }
        const result = await check_package_deviation(project.path, project.name, {
            verbose: is_verbose,
            skip_build: skip_build
        });
        deviation_checks.push(result);
    }
    // Find packages with lagging dependencies
    console.log('\n🔍 Checking for lagging dependencies...');
    const packages_with_lagging_deps = new Set();
    projects.forEach(project => {
        Object.entries(project.dependencies).forEach(([dep_name, version]) => {
            if (sibling_projects.has(dep_name)) {
                const actual_version = project_versions.get(dep_name);
                const clean_required_version = version.replace(/[\^~>=<]/g, ''); // Remove version range operators
                if (actual_version !== clean_required_version) {
                    packages_with_lagging_deps.add(project.name);
                    if (is_verbose) {
                        console.log(`  ${get_relative_path(project.path)} depends on ${dep_name}@${version}, but current version is ${actual_version}`);
                    }
                }
            }
        });
    });
    // Collect all problem packages
    const packages_with_deviations = new Set(deviation_checks
        .filter(result => result.deviates && !result.error)
        .map(result => result.package_name));
    const all_problem_packages = new Set([
        ...packages_with_deviations,
        ...packages_with_lagging_deps
    ]);
    if (all_problem_packages.size === 0) {
        console.log('\n🎉 No problems found!');
        console.log('All packages are up to date and have current dependencies.');
        if (publish_mode) {
            console.log('\n📝 No packages need publishing - all are up to date!');
        }
        return;
    }
    // Filter projects to only those with problems
    const problem_projects = projects.filter(p => all_problem_packages.has(p.name));
    // Perform topological sort on problem packages
    console.log('\n📊 Sorting problem packages topologically...');
    const sorted_problem_packages = topological_sort(problem_projects, sibling_projects);
    // Determine which packages are safe to publish without creating recursive issues
    console.log('🔍 Analyzing recursive dependency impacts...');
    const safe_to_publish = get_safe_to_publish_packages(sorted_problem_packages, projects, sibling_projects, project_versions, packages_with_deviations, packages_with_lagging_deps);
    if (is_verbose) {
        console.log(`   Safe to publish: ${safe_to_publish.size} packages`);
        console.log(`   Would create issues: ${sorted_problem_packages.length - safe_to_publish.size} packages`);
    }
    // Display results in table format
    console.log('\n🚨 PROBLEM PACKAGES (topologically sorted):');
    console.log('═'.repeat(90));
    // Table headers
    const nameWidth = Math.max(20, Math.max(...sorted_problem_packages.map(name => name.length)) + 2);
    const publishWidth = 20;
    const dependenciesWidth = 30;
    const safeWidth = 15;
    console.log(`${'NAME'.padEnd(nameWidth)} ${'PUBLISH'.padEnd(publishWidth)} ${'DEPENDENCIES'.padEnd(dependenciesWidth)} ${'SAFE TO PUBLISH'.padEnd(safeWidth)}`);
    console.log('─'.repeat(nameWidth) + ' ' + '─'.repeat(publishWidth) + ' ' + '─'.repeat(dependenciesWidth) + ' ' + '─'.repeat(safeWidth));
    sorted_problem_packages.forEach((package_name) => {
        const deviation_result = deviation_checks.find(r => r.package_name === package_name);
        const has_lagging_deps = packages_with_lagging_deps.has(package_name);
        const is_safe_to_publish = safe_to_publish.has(package_name);
        // Determine publish status
        let publish_status = '✅ OK';
        if (deviation_result?.deviates) {
            if (deviation_result.build_failed) {
                publish_status = '🔧 BUILD FAILED';
            }
            else if (!deviation_result.published_exists) {
                publish_status = '📦 NOT PUBLISHED';
            }
            else {
                publish_status = '🔄 DIFFERS';
            }
        }
        // Determine dependencies status
        let deps_status = '✅ OK';
        let lagging_count = 0;
        if (has_lagging_deps) {
            const project = projects.find(p => p.name === package_name);
            Object.entries(project.dependencies).forEach(([dep_name, version]) => {
                if (sibling_projects.has(dep_name)) {
                    const actual_version = project_versions.get(dep_name);
                    const clean_required_version = version.replace(/[\^~>=<]/g, '');
                    if (actual_version !== clean_required_version) {
                        lagging_count++;
                    }
                }
            });
            deps_status = `⚠️  ${lagging_count} LAGGING`;
        }
        // Determine safety status
        let safety_status = '❌ NO';
        const needs_publishing = packages_with_deviations.has(package_name) || packages_with_lagging_deps.has(package_name);
        if (!needs_publishing) {
            safety_status = '➖ N/A'; // No publishing needed at all
        }
        else if (is_safe_to_publish) {
            safety_status = '✅ YES';
        }
        console.log(`${package_name.padEnd(nameWidth)} ${publish_status.padEnd(publishWidth)} ${deps_status.padEnd(dependenciesWidth)} ${safety_status.padEnd(safeWidth)}`);
        // Show detailed lagging dependencies if verbose
        if (is_verbose && has_lagging_deps) {
            const project = projects.find(p => p.name === package_name);
            Object.entries(project.dependencies).forEach(([dep_name, version]) => {
                if (sibling_projects.has(dep_name)) {
                    const actual_version = project_versions.get(dep_name);
                    const clean_required_version = version.replace(/[\^~>=<]/g, '');
                    if (actual_version !== clean_required_version) {
                        console.log(`${''.padEnd(nameWidth)} ${''.padEnd(publishWidth)} ↳ ${dep_name}: ${version} → ${actual_version}`);
                    }
                }
            });
        }
    });
    console.log('');
    console.log('Legend:');
    console.log('  PUBLISH: ✅ OK | 🔄 DIFFERS | 📦 NOT PUBLISHED | 🔧 BUILD FAILED');
    console.log('  DEPENDENCIES: ✅ OK | ⚠️  X LAGGING (X = count of outdated deps)');
    console.log('  SAFE TO PUBLISH: ✅ YES | ❌ NO (would create new issues) | ➖ N/A (no issues)');
    // Publishing mode: ask user if they want to publish each package
    if (publish_mode) {
        console.log('\n🚀 PUBLISHING MODE');
        console.log('═'.repeat(50));
        const readline = require('readline');
        const rl = readline.createInterface({
            input: process.stdin,
            output: process.stdout
        });
        const askQuestion = (question) => {
            return new Promise((resolve) => {
                rl.question(question, (answer) => {
                    resolve(answer);
                });
            });
        };
        let published_count = 0;
        let skipped_count = 0;
        for (const package_name of sorted_problem_packages) {
            const project = projects.find(p => p.name === package_name);
            const deviation_result = deviation_checks.find(r => r.package_name === package_name);
            const is_safe_to_publish = safe_to_publish.has(package_name);
            // Check for name mismatch error
            const has_name_mismatch = project.name !== project.dir_name;
            if (has_name_mismatch) {
                console.log(`\n❌ Skipping ${package_name}: Package name doesn't match directory name '${project.dir_name}'`);
                console.log(`   Fix: Rename directory to '${package_name}' or update package.json name to '${project.dir_name}'`);
                skipped_count++;
                continue;
            }
            // Skip packages that can't be published (build failed, errors)
            if (deviation_result?.error) {
                console.log(`\n❌ Skipping ${package_name}: ${deviation_result.error}`);
                skipped_count++;
                continue;
            }
            if (deviation_result?.build_failed) {
                console.log(`\n🔧 Skipping ${package_name}: Build failed (fix build first)`);
                skipped_count++;
                continue;
            }
            // Skip packages that are not safe to publish (would create recursive issues)
            if (!is_safe_to_publish) {
                console.log(`\n⚠️  Skipping ${package_name}: Publishing would create dependency issues for other packages`);
                console.log(`   Tip: Fix dependent packages first, or publish them together`);
                skipped_count++;
                continue;
            }
            // Only ask about packages that differ from published or have lagging dependencies
            if (deviation_result?.deviates || packages_with_lagging_deps.has(package_name)) {
                console.log(`\n📦 Package: ${package_name}`);
                console.log(`   Path: ${get_relative_path(project.path)}`);
                if (!deviation_result.published_exists) {
                    console.log(`   Status: Not published yet`);
                }
                else if (packages_with_lagging_deps.has(package_name) && !deviation_result.deviates) {
                    console.log(`   Status: Has lagging dependencies - needs republishing with updated deps`);
                }
                else {
                    console.log(`   Status: Differs from published version`);
                }
                const answer = await askQuestion('   Do you want to publish this package? (y/n/q): ');
                if (answer.toLowerCase() === 'q') {
                    console.log('\n⏹️  Publishing cancelled by user');
                    break;
                }
                else if (answer.toLowerCase() === 'y' || answer.toLowerCase() === 'yes') {
                    console.log(`   🚀 Publishing ${package_name}...`);
                    try {
                        // Use the existing publish.js script if it exists, otherwise use npm publish
                        const publish_script = path.join(__dirname, '..', 'publish.js');
                        let publish_command;
                        if (fs.existsSync(publish_script)) {
                            // Check if publish.js is executable
                            try {
                                fs.accessSync(publish_script, fs.constants.X_OK);
                                publish_command = `"${publish_script}" "${project.path}"`;
                            }
                            catch {
                                publish_command = `node "${publish_script}" "${project.path}"`;
                            }
                        }
                        else {
                            publish_command = 'npm publish';
                        }
                        console.log(`   Running: ${publish_command}`);
                        execSync(publish_command, {
                            cwd: project.path,
                            stdio: 'inherit'
                        });
                        console.log(`   ✅ Successfully published ${package_name}`);
                        published_count++;
                    }
                    catch (publish_err) {
                        console.log(`   ❌ Failed to publish ${package_name}: ${publish_err.message}`);
                        skipped_count++;
                    }
                }
                else {
                    console.log(`   ⏭️  Skipped ${package_name}`);
                    skipped_count++;
                }
            }
        }
        rl.close();
        console.log('\n📊 PUBLISHING SUMMARY');
        console.log('═'.repeat(30));
        console.log(`✅ Published: ${published_count}`);
        console.log(`⏭️  Skipped: ${skipped_count}`);
        console.log(`📦 Total processed: ${published_count + skipped_count}`);
        if (published_count > 0) {
            console.log('\n💡 Tip: Run the script again to see if dependency issues are resolved.');
        }
    }
    console.log('');
    console.log(`Summary:`);
    console.log(`  - Total packages: ${projects.length}`);
    console.log(`  - Problem packages: ${all_problem_packages.size}`);
    console.log(`  - Packages with deviations: ${packages_with_deviations.size}`);
    console.log(`  - Packages with lagging deps: ${packages_with_lagging_deps.size}`);
    console.log(`  - Safe to publish: ${safe_to_publish.size}`);
    if (name_mismatches.length > 0) {
        console.log(`  - Name mismatches: ${name_mismatches.length}`);
    }
    // Show errors if any
    const errors = deviation_checks.filter(result => result.error);
    if (errors.length > 0) {
        console.log('\n❌ ERRORS:');
        errors.forEach(result => {
            console.log(`  ${result.package_name}: ${result.error}`);
        });
    }
    // Exit with error code if there are problems
    process.exit(all_problem_packages.size > 0 ? 1 : 0);
}
main().catch(err => {
    console.error('Unexpected error:', err.message);
    process.exit(1);
});
