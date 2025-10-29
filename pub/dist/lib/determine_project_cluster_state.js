"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.determine_project_cluster_state = determine_project_cluster_state;
exports.summarize_cluster_state = summarize_cluster_state;
const determine_project_state_1 = require("./determine_project_state");
const fs = require('fs');
const path = require('path');
/**
 * Calculate topological order of projects based on their dependencies
 * @param projects - Projects with their states
 * @returns Array of project names in dependency order (dependencies first)
 */
function calculate_topological_order(projects) {
    const project_names = Object.keys(projects).filter(name => projects[name][0] === 'project');
    const visited = new Set();
    const visiting = new Set();
    const sorted = [];
    function visit(project_name, path = []) {
        if (visiting.has(project_name)) {
            // Circular dependency detected - add to end to break cycle
            console.warn(`Circular dependency detected: ${[...path, project_name].join(' -> ')}`);
            return;
        }
        if (visited.has(project_name)) {
            return;
        }
        visiting.add(project_name);
        // Visit dependencies first (if they are projects in this cluster)
        const project_entry = projects[project_name];
        if (project_entry && project_entry[0] === 'project') {
            const project_state = project_entry[1];
            const sibling_deps = Object.keys(project_state.dependencies)
                .filter(dep_name => project_names.includes(dep_name));
            for (const dep of sibling_deps) {
                visit(dep, [...path, project_name]);
            }
        }
        visiting.delete(project_name);
        visited.add(project_name);
        sorted.push(project_name);
    }
    // Visit all projects
    for (const project_name of project_names) {
        visit(project_name);
    }
    return sorted;
}
/**
 * Determine the state of all projects in a cluster directory
 *
 * This function scans the given cluster path for subdirectories and
 * determines the project state for each one that appears to be a valid project.
 *
 * A directory is considered a valid project if:
 * - It contains a 'pub' subdirectory, OR
 * - It contains a 'package.json' file, OR
 * - It contains a '.git' directory
 *
 * @param cluster_path - Path to the directory containing multiple projects
 * @returns Project_Cluster_State - Object mapping project names to their states
 */
function determine_project_cluster_state(cluster_path) {
    const projects = {};
    try {
        // Check if cluster path exists
        if (!fs.existsSync(cluster_path)) {
            console.warn(`Cluster path does not exist: ${cluster_path}`);
            return {
                projects,
                'topological order': []
            };
        }
        // Read all entries in the cluster directory
        const entries = fs.readdirSync(cluster_path, { withFileTypes: true });
        // Filter to only directories
        const directories = entries
            .filter((entry) => entry.isDirectory())
            .map((entry) => entry.name);
        // Check each directory to see if it's a valid project
        for (const node_name of directories) {
            const project_path = path.join(cluster_path, node_name);
            if (is_valid_project(project_path)) {
                try {
                    console.log(`Analyzing project: ${node_name}`);
                    const project_state = (0, determine_project_state_1.determine_project_state)(project_path, node_name);
                    projects[node_name] = ['project', project_state];
                }
                catch (err) {
                    console.error(`Error analyzing project ${node_name}:`, err.message);
                    // Create a minimal error state for this project
                    projects[node_name] = ['project', {
                            'package name in sync with directory name': false,
                            'version': '0.0.0',
                            'git': {
                                'staged files': false,
                                'dirty working tree': false,
                                'unpushed commits': false
                            },
                            'structure': ['invalid', { errors: [`Failed to analyze project: ${err.message}`] }],
                            'test': ['failure', ['build', null]],
                            'dependencies': {}
                        }];
                }
            }
            else {
                console.log(`Skipping non-project directory: ${node_name}`);
                projects[node_name] = ['not a project', null];
            }
        }
        // Calculate topological order
        const topological_order = calculate_topological_order(projects);
        return {
            projects,
            'topological order': topological_order
        };
    }
    catch (err) {
        console.error(`Error reading cluster directory ${cluster_path}:`, err.message);
        return {
            projects,
            'topological order': []
        };
    }
}
/**
 * Check if a directory appears to be a valid project
 *
 * @param project_path - Path to the potential project directory
 * @returns boolean - True if the directory appears to be a project
 */
function is_valid_project(project_path) {
    try {
        // Check for common project indicators
        const indicators = [
            path.join(project_path, 'pub'), // Pareto-style project
            path.join(project_path, 'package.json'), // Node.js project
            path.join(project_path, '.git'), // Git repository
            path.join(project_path, 'src'), // Source directory
            path.join(project_path, 'tsconfig.json'), // TypeScript project
            path.join(project_path, 'README.md') // Documentation
        ];
        // Return true if any indicator exists
        return indicators.some(indicator => fs.existsSync(indicator));
    }
    catch (err) {
        // If we can't check the directory, assume it's not a project
        return false;
    }
}
/**
 * Get a summary of the cluster state
 *
 * @param cluster_state - The cluster state object
 * @returns Summary object with counts and lists
 */
function summarize_cluster_state(cluster_state) {
    const summary = {
        total_nodes: 0,
        total_projects: 0,
        non_projects: 0,
        healthy_projects: 0,
        projects_with_issues: 0,
        projects_with_dirty_trees: 0,
        projects_with_staged_files: 0,
        projects_with_unpushed_commits: 0,
        projects_with_structure_errors: 0,
        projects_with_test_failures: 0,
        projects_with_name_mismatches: 0,
        projects_with_dependency_issues: 0,
        node_names: [],
        project_names: [],
        non_project_names: [],
        healthy_project_names: [],
        problematic_project_names: []
    };
    for (const [node_name, node_entry] of Object.entries(cluster_state.projects)) {
        summary.total_nodes++;
        summary.node_names.push(node_name);
        if (node_entry[0] === 'not a project') {
            summary.non_projects++;
            summary.non_project_names.push(node_name);
        }
        else {
            // It's a project
            summary.total_projects++;
            summary.project_names.push(node_name);
            const project_state = node_entry[1];
            let has_issues = false;
            // Check git state
            if (project_state.git['staged files']) {
                summary.projects_with_staged_files++;
            }
            if (project_state.git['dirty working tree']) {
                summary.projects_with_dirty_trees++;
            }
            if (project_state.git['unpushed commits']) {
                summary.projects_with_unpushed_commits++;
            }
            // Check package name sync
            if (!project_state['package name in sync with directory name']) {
                summary.projects_with_name_mismatches++;
                has_issues = true;
            }
            // Check structure
            if (project_state.structure[0] === 'invalid') {
                summary.projects_with_structure_errors++;
                has_issues = true;
            }
            // Check tests
            if (project_state.test[0] === 'failure') {
                summary.projects_with_test_failures++;
                has_issues = true;
            }
            // Check dependencies
            let has_dependency_issues = false;
            for (const [_, dep_info] of Object.entries(project_state.dependencies)) {
                if (dep_info.target[0] === 'not found' ||
                    (dep_info.target[0] === 'found' && !dep_info.target[1]['dependency up to date'])) {
                    has_dependency_issues = true;
                    break;
                }
            }
            if (has_dependency_issues) {
                summary.projects_with_dependency_issues++;
                has_issues = true;
            }
            // Categorize project health
            if (has_issues) {
                summary.projects_with_issues++;
                summary.problematic_project_names.push(node_name);
            }
            else {
                summary.healthy_projects++;
                summary.healthy_project_names.push(node_name);
            }
        }
    }
    return summary;
}
