import * as d_in from "../interface/package_state"

/**
 * Convert Project_Cluster_State to GraphViz DOT format
 *  * 
 * @param cluster_state - The project cluster state
 * @param options - Configuration options
 * @returns DOT format string for GraphViz
 */
export function project_cluster_state_to_dot(
    cluster_state: d_in.Package_Cluster_State,
    options: {
        include_legend?: boolean
        cluster_path?: string
        show_warnings?: boolean
    } = {}
): string {
    const { include_legend = true, cluster_path = ".", show_warnings = false } = options;

    // Helper functions (replicated from dependency graph)
    function escape_dot_string(str: string): string {
        return str.replace(/"/g, '\\"');
    }

    function safe_node_id(name: string): string {
        return name.replace(/[^a-zA-Z0-9_]/g, '_');
    }

    // Extract project information from cluster state
    const projects: Array<{
        name: string
        version: string | null
        dependencies: { [name: string]: string }
        has_issues: boolean
        is_name_synced: boolean
    }> = [];

    const all_project_names = new Set<string>();
    const external_dependencies = new Set<string>();

    // Process each project in cluster state
    for (const [project_name, project_entry] of Object.entries(cluster_state.projects)) {
        // Only process actual projects, skip non-projects
        if (project_entry[0] === 'not a project') {
            continue;
        }
        
        const project_state = project_entry[1];
        all_project_names.add(project_name);

        // Extract dependencies with their version strings
        const dependencies: { [name: string]: string } = {};
        for (const [dep_name, dep_info] of Object.entries(project_state.dependencies)) {
            dependencies[dep_name] = dep_info.version;
            
            // Track external dependencies (not in cluster)
            if (!all_project_names.has(dep_name)) {
                external_dependencies.add(dep_name);
            }
        }

        // Determine if project has issues
        const has_issues = (
            project_state.structure[0] === 'invalid' ||
            project_state.test[0] === 'failure' ||
            project_state.git['staged files'] ||
            project_state.git['dirty working tree'] ||
            Object.values(project_state.dependencies).some(dep => 
                dep.target[0] === 'not found' || 
                (dep.target[0] === 'found' && !dep.target[1]['dependency up to date'])
            )
        );

        projects.push({
            name: project_name,
            version: project_state.version,
            dependencies,
            has_issues,
            is_name_synced: project_state['package name in sync with directory name']
        });
    }

    // Update external dependencies (remove any that are actually in cluster)
    for (const project_name of all_project_names) {
        external_dependencies.delete(project_name);
    }

    // Build dependency edges
    const edges: Array<{
        from: string
        to: string
        version: string
        is_sibling: boolean
        has_version_mismatch: boolean
        target_has_issues: boolean
        color: string
    }> = [];

    for (const project of projects) {
        for (const [dep_name, dep_version] of Object.entries(project.dependencies)) {
            const is_sibling = all_project_names.has(dep_name);
            let has_version_mismatch = false;
            let target_has_issues = false;

            if (is_sibling) {
                // Check version mismatch with sibling
                const target_project = projects.find(p => p.name === dep_name);
                if (target_project) {
                    // Clean version strings for comparison (remove ^ ~ >= etc.)
                    const clean_required = dep_version.replace(/[\^~>=<]/g, '');
                    const target_version = target_project.version !== null ? target_project.version : 'n/a';
                    has_version_mismatch = target_version !== clean_required;
                    target_has_issues = target_project.has_issues;
                }
            }

            // Determine edge color
            let color: string;
            if (!is_sibling) {
                color = 'lightgrey'; // External dependencies
            } else if (has_version_mismatch) {
                color = 'yellow'; // Version mismatch
            } else if (target_has_issues) {
                color = 'red'; // Target has issues
            } else {
                color = 'blue'; // All good
            }

            edges.push({
                from: project.name,
                to: dep_name,
                version: dep_version,
                is_sibling,
                has_version_mismatch,
                target_has_issues,
                color
            });
        }
    }

    // Generate DOT content
    let dot_content = `digraph dependencies {
    rankdir=TB;
    node [shape=box, style=filled];
    
    // Graph title
    labelloc="t";
    label="Dependency Graph\\nGenerated: ${new Date().toISOString()}\\nDirectory: ${cluster_path}";
    
    // Define node styles${include_legend ? `
    subgraph cluster_legend {
        label="Legend";
        style=filled;
        color=lightgrey;
        
        healthy_project [label="Healthy Project", fillcolor=lightblue, shape=box];
        problematic_project [label="Project with Issues", fillcolor=lightcoral, shape=box];
        name_mismatch_project [label="Name Mismatch", fillcolor=orange, shape=box];
        external_dep [label="External Package", fillcolor=yellow, shape=ellipse];
        
        healthy_project -> external_dep [style=invis];
        problematic_project -> external_dep [style=invis];
        name_mismatch_project -> external_dep [style=invis];
        
        edge_ok [label="OK", style=invis];
        edge_behind [label="Behind", style=invis];
        edge_blocked [label="Blocked", style=invis];
        
        healthy_project -> edge_ok [color=blue, penwidth=2, label="Up to date"];
        healthy_project -> edge_behind [color=yellow, penwidth=2, label="Version behind"];
        healthy_project -> edge_blocked [color=red, penwidth=2, label="Target has issues"];
    }` : ''}
    
    // Project nodes (sibling repositories)
`;

    // Add project nodes
    for (const project of projects) {
        const node_id = safe_node_id(project.name);
        const version_display = project.version !== null ? project.version : 'n/a';
        const version_label = version_display === 'n/a' ? 'n/a' : `v${version_display}`;
        const label = `${escape_dot_string(project.name)}\\n${version_label}`;

        // Determine node color
        let node_color: string;
        if (!project.is_name_synced) {
            node_color = 'orange'; // Name mismatch
        } else if (project.has_issues) {
            node_color = 'lightcoral'; // Has issues
        } else {
            node_color = 'lightblue'; // Healthy
        }

        dot_content += `    ${node_id} [label="${label}", fillcolor=${node_color}];\n`;
    }

    dot_content += '\n    // External dependency nodes\n';

    // Add external dependency nodes
    for (const dep of external_dependencies) {
        const node_id = safe_node_id(dep);
        const label = escape_dot_string(dep);
        dot_content += `    ${node_id} [label="${label}", fillcolor=yellow, shape=ellipse];\n`;
    }

    dot_content += '\n    // Dependencies\n';

    // Add dependency edges
    for (const edge of edges) {
        const from_id = safe_node_id(edge.from);
        const to_id = safe_node_id(edge.to);

        // Build edge style
        let edge_style: string;
        if (edge.is_sibling) {
            edge_style = `color=${edge.color}, penwidth=2`;
        } else {
            edge_style = 'color=lightgrey, style=dashed';
        }

        // Clean version for display
        const clean_version = edge.version.replace(/[\^~]/g, '');
        
        dot_content += `    ${from_id} -> ${to_id} [label="${escape_dot_string(clean_version)}", ${edge_style}];\n`;
    }

    dot_content += '}\n';

    return dot_content;
}