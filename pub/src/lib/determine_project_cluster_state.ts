import { Project_Cluster_State } from "../interface/project_cluster_state";
import { determine_project_state } from "./determine_project_state";
const fs = require('fs');
const path = require('path');

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
export function determine_project_cluster_state(cluster_path: string): Project_Cluster_State {
    const cluster_state: Project_Cluster_State = {};
    
    try {
        // Check if cluster path exists
        if (!fs.existsSync(cluster_path)) {
            console.warn(`Cluster path does not exist: ${cluster_path}`);
            return cluster_state;
        }
        
        // Read all entries in the cluster directory
        const entries = fs.readdirSync(cluster_path, { withFileTypes: true });
        
        // Filter to only directories
        const directories = entries
            .filter((entry: any) => entry.isDirectory())
            .map((entry: any) => entry.name);
        
        // Check each directory to see if it's a valid project
        for (const dir_name of directories) {
            const project_path = path.join(cluster_path, dir_name);
            
            if (is_valid_project(project_path)) {
                try {
                    console.log(`Analyzing project: ${dir_name}`);
                    const project_state = determine_project_state(project_path);
                    cluster_state[dir_name] = project_state;
                } catch (err: any) {
                    console.error(`Error analyzing project ${dir_name}:`, err.message);
                    // Create a minimal error state for this project
                    cluster_state[dir_name] = {
                        git: {
                            'staged files': false,
                            'dirty working tree': false,
                            'unpushed commits': false
                        },
                        structure: ['invalid', { errors: [`Failed to analyze project: ${err.message}`] }],
                        test: ['failure', ['build', null]],
                        dependencies: {}
                    };
                }
            } else {
                console.log(`Skipping non-project directory: ${dir_name}`);
            }
        }
        
    } catch (err: any) {
        console.error(`Error reading cluster directory ${cluster_path}:`, err.message);
    }
    
    return cluster_state;
}

/**
 * Check if a directory appears to be a valid project
 * 
 * @param project_path - Path to the potential project directory
 * @returns boolean - True if the directory appears to be a project
 */
function is_valid_project(project_path: string): boolean {
    try {
        // Check for common project indicators
        const indicators = [
            path.join(project_path, 'pub'),           // Pareto-style project
            path.join(project_path, 'package.json'),  // Node.js project
            path.join(project_path, '.git'),          // Git repository
            path.join(project_path, 'src'),           // Source directory
            path.join(project_path, 'tsconfig.json'), // TypeScript project
            path.join(project_path, 'README.md')      // Documentation
        ];
        
        // Return true if any indicator exists
        return indicators.some(indicator => fs.existsSync(indicator));
        
    } catch (err) {
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
export function summarize_cluster_state(cluster_state: Project_Cluster_State) {
    const summary = {
        total_projects: 0,
        healthy_projects: 0,
        projects_with_issues: 0,
        projects_ready_to_commit: 0,
        projects_with_dirty_trees: 0,
        projects_with_staged_files: 0,
        projects_with_unpushed_commits: 0,
        projects_with_structure_errors: 0,
        projects_with_test_failures: 0,
        projects_with_outdated_dependencies: 0,
        
        project_names: [] as string[],
        healthy_project_names: [] as string[],
        problematic_project_names: [] as string[]
    };
    
    for (const [project_name, project_state] of Object.entries(cluster_state)) {
        summary.total_projects++;
        summary.project_names.push(project_name);
        
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
        let has_outdated_deps = false;
        for (const [_, dep_state] of Object.entries(project_state.dependencies)) {
            if (dep_state[0] === 'target found' && !dep_state[1]['up to date']) {
                has_outdated_deps = true;
                break;
            }
        }
        if (has_outdated_deps) {
            summary.projects_with_outdated_dependencies++;
            has_issues = true;
        }
        
        // Determine if project is ready to commit
        const ready_to_commit = (
            project_state.structure[0] === 'valid' &&
            project_state.test[0] === 'success' &&
            !project_state.git['staged files'] &&
            !has_outdated_deps
        );
        
        if (ready_to_commit) {
            summary.projects_ready_to_commit++;
        }
        
        // Categorize project health
        if (has_issues) {
            summary.projects_with_issues++;
            summary.problematic_project_names.push(project_name);
        } else {
            summary.healthy_projects++;
            summary.healthy_project_names.push(project_name);
        }
    }
    
    return summary;
}