#!/usr/bin/env node
/**
 * Cluster State Analysis Tool
 *
 * This utility analyzes all projects in a given directory and reports their states.
 *
 * Usage: node cluster_state_analysis.js <cluster_path>
 */
const path = require('path');
const { determine_project_cluster_state, summarize_cluster_state } = require('../lib/determine_project_cluster_state');
function main() {
    const args = process.argv.slice(2);
    if (args.length === 0) {
        console.error('Usage: node cluster_state_analysis.js <cluster_path>');
        console.error('');
        console.error('Example: node cluster_state_analysis.js /home/user/projects');
        process.exit(1);
    }
    const cluster_path = path.resolve(args[0]);
    console.log(`🔍 Analyzing project cluster at: ${cluster_path}`);
    console.log('');
    // Analyze the cluster
    const cluster_state = determine_project_cluster_state(cluster_path);
    // Get summary
    const summary = summarize_cluster_state(cluster_state);
    // Display summary
    console.log('📊 CLUSTER SUMMARY');
    console.log('==================');
    console.log(`Total nodes: ${summary.total_nodes}`);
    console.log(`Total projects: ${summary.total_projects}`);
    console.log(`Non-projects: ${summary.non_projects}`);
    console.log(`Healthy projects: ${summary.healthy_projects}`);
    console.log(`Projects with issues: ${summary.projects_with_issues}`);
    console.log('');
    console.log('🔧 DETAILED BREAKDOWN');
    console.log('======================');
    console.log(`Projects with dirty working trees: ${summary.projects_with_dirty_trees}`);
    console.log(`Projects with staged files: ${summary.projects_with_staged_files}`);
    console.log(`Projects with unpushed commits: ${summary.projects_with_unpushed_commits}`);
    console.log(`Projects with structure errors: ${summary.projects_with_structure_errors}`);
    console.log(`Projects with test failures: ${summary.projects_with_test_failures}`);
    console.log(`Projects with outdated dependencies: ${summary.projects_with_outdated_dependencies}`);
    console.log('');
    if (summary.healthy_project_names.length > 0) {
        console.log('✅ HEALTHY PROJECTS');
        console.log('===================');
        summary.healthy_project_names.forEach(name => {
            console.log(`  • ${name}`);
        });
        console.log('');
    }
    if (summary.problematic_project_names.length > 0) {
        console.log('⚠️  PROJECTS WITH ISSUES');
        console.log('========================');
        summary.problematic_project_names.forEach(name => {
            console.log(`  • ${name}`);
            const project_entry = cluster_state.projects[name];
            if (project_entry && project_entry[0] === 'project') {
                const project_state = project_entry[1];
                // Show specific issues
                if (project_state.structure[0] === 'invalid') {
                    console.log(`    - Structure errors: ${project_state.structure[1].errors.length}`);
                }
                if (project_state.test[0] === 'failure') {
                    console.log(`    - Test failures: ${project_state.test[1][0]}`);
                }
                if (!project_state['package name in sync with directory name']) {
                    console.log(`    - Package name mismatch`);
                }
                // Check for dependency issues
                let dependency_issues = 0;
                for (const [_, dep_info] of Object.entries(project_state.dependencies)) {
                    if (dep_info.target[0] === 'not found' ||
                        (dep_info.target[0] === 'found' && !dep_info.target[1]['dependency up to date'])) {
                        dependency_issues++;
                    }
                }
                if (dependency_issues > 0) {
                    console.log(`    - Dependency issues: ${dependency_issues}`);
                }
            }
        });
        console.log('');
    }
    // Detailed per-project information (if requested)
    if (args.includes('--detailed')) {
        console.log('📋 DETAILED PROJECT STATES');
        console.log('===========================');
        for (const [project_name, project_entry] of Object.entries(cluster_state.projects)) {
            if (project_entry[0] === 'project') {
                const project_state = project_entry[1];
                console.log(`\n🔸 ${project_name}`);
                console.log(`   Package name sync: ${project_state['package name in sync with directory name']}`);
                console.log(`   Version: ${project_state.version}`);
                console.log(`   Git: staged=${project_state.git['staged files']}, dirty=${project_state.git['dirty working tree']}, unpushed=${project_state.git['unpushed commits']}`);
                console.log(`   Structure: ${project_state.structure[0]} ${project_state.structure[0] === 'invalid' ? `(${project_state.structure[1].errors.length} errors)` : `(${project_state.structure[1].warnings.length} warnings)`}`);
                console.log(`   Tests: ${project_state.test[0]}`);
                console.log(`   Dependencies: ${Object.keys(project_state.dependencies).length} packages`);
            }
        }
    }
    console.log('');
    console.log('💡 Use --detailed flag for per-project breakdown');
}
if (require.main === module) {
    main();
}
