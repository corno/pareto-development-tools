#!/usr/bin/env node
const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');
const { build_project, is_node_project } = require('../../lib/build_test_utils');
const { analyze_dependencies, get_build_order } = require('../../lib/dependency_graph_utils');
// Get target directory from command line argument (skip --verbose flag)
const args = process.argv.slice(2);
const target_dir = args.find(arg => !arg.startsWith('--'));
if (!target_dir) {
    console.error('Error: Please provide a target directory path');
    console.error('Usage: pareto all build <directory> [--verbose]');
    process.exit(1);
}
const base_dir = path.resolve(target_dir);
if (!fs.existsSync(base_dir)) {
    console.error(`Error: Directory ${target_dir} does not exist`);
    process.exit(1);
}
// Check for --verbose argument
const verbose = process.argv.includes('--verbose');
// Helper to get relative path for display
const get_relative_path = (absolute_path) => {
    const rel = path.relative(process.cwd(), absolute_path);
    return rel.startsWith('..') || rel.startsWith('.') ? rel : './' + rel;
};
console.log('Analyzing dependencies to determine build order...');
// Analyze dependencies (include dev deps to ensure proper build order)
const dep_graph = analyze_dependencies(base_dir, true);
if (dep_graph.projects.length === 0) {
    console.error('No Node.js projects found in the specified directory');
    process.exit(1);
}
// Get build order (topologically sorted)
let build_order;
try {
    build_order = get_build_order(dep_graph);
}
catch (err) {
    console.error(`Error: ${err.message}`);
    process.exit(1);
}
console.log(`Found ${build_order.length} projects to build in dependency order:`);
build_order.forEach((project, index) => {
    const deps = dep_graph.dependency_map.get(project.name) || [];
    const dep_info = deps.length > 0 ? ` (depends on: ${deps.join(', ')})` : '';
    console.log(`  ${index + 1}. ${get_relative_path(project.path)}${dep_info}`);
});
console.log('\nBuilding projects...\n');
// Build projects in dependency order
let failed_count = 0;
let success_count = 0;
for (const project of build_order) {
    console.log(`Building ${get_relative_path(project.path)}...`);
    try {
        const build_succeeded = build_project(project.path, {
            verbose: verbose,
            throw_on_error: false
        });
        if (build_succeeded) {
            console.log(`✓ ${get_relative_path(project.path)} built successfully`);
            success_count++;
        }
        else {
            console.error(`❌ ${get_relative_path(project.path)} build failed`);
            failed_count++;
        }
    }
    catch (err) {
        console.error(`❌ Failed to build ${get_relative_path(project.path)}:`, err.message);
        failed_count++;
    }
}
console.log(`\nBuild summary:`);
console.log(`  ✓ ${success_count} succeeded`);
console.log(`  ❌ ${failed_count} failed`);
if (failed_count > 0) {
    process.exit(1);
}
