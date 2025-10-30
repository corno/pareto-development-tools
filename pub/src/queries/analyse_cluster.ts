import { Cluster_State, Package_State } from "../interface/package_state"
import { determine_package_state } from "../old_lib/determine_package_state"

const fs = require('fs');
const path = require('path');

export type Parameters = {
    'cluster path': string
    'build and test': boolean,
    'compare to published': boolean,
}

export const $$ = (
    $p: Parameters
): Cluster_State => {
    const projects: { [node_name: string]: ['not a project', null] | ['project', Package_State] } = {};

    // Check if cluster path exists
    if (!fs.existsSync($p['cluster path'])) {
        return ['not found', null];
    }

    // Read all entries in the cluster directory
    const entries = fs.readdirSync($p['cluster path'], { withFileTypes: true });

    // Filter to only directories
    const directories = entries
        .filter((entry: any) => entry.isDirectory())
        .map((entry: any) => entry.name);

    // Check each directory to see if it's a valid project
    for (const node_name of directories) {
        const project_path = path.join($p['cluster path'], node_name);

        const looks_like_project = (project_path: string): boolean => {
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
        if (looks_like_project(project_path)) {
            const project_state = determine_package_state(
                {
                    'build and test': $p['build and test'],
                    'compare to published': $p['compare to published'],
                    'directory name': node_name,
                    'path to package': $p['cluster path'],
                }
            );
            projects[node_name] = ['project', project_state];
        } else {
            projects[node_name] = ['not a project', null];
        }
    }

    // Calculate topological order
    /**
     * Calculate topological order of projects based on their dependencies
     * @param projects - Projects with their states
     * @returns Tagged union: circular dependencies detected or valid order array
     */
    function calculate_topological_order(projects: { [node_name: string]: ['not a project', null] | ['project', Package_State] }): ['circular dependencies', null] | ['valid order', string[]] {
        const project_names = Object.keys(projects).filter(name => projects[name][0] === 'project');
        const visited = new Set<string>();
        const visiting = new Set<string>();
        const sorted: string[] = [];
        let has_circular_dependency = false;

        function visit(project_name: string, path: string[] = []): void {
            if (visiting.has(project_name)) {
                // Circular dependency detected
                has_circular_dependency = true;
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

        if (has_circular_dependency) {
            return ['circular dependencies', null];
        }

        return ['valid order', sorted];
    }

    const topological_order = calculate_topological_order(projects);

    return ['cluster', {
        projects,
        'topological order': topological_order
    }];
}