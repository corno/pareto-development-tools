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
        issues: string[]
        is_name_synced: boolean
        has_unpushed_work: boolean
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

        // Collect detailed issue information
        const issues: string[] = [];
        
        if (project_state.structure[0] === 'invalid') {
            issues.push('Structure Invalid');
        }
        if (project_state.test[0] === 'failure') {
            const test_failure = project_state.test[1];
            if (test_failure[0] === 'build') {
                issues.push('Build Failed');
            } else if (test_failure[0] === 'test') {
                issues.push('Tests Failed');
            }
        }
        if (project_state.git['staged files']) {
            issues.push('Staged Files');
        }
        if (project_state.git['dirty working tree']) {
            issues.push('Dirty Tree');
        }
        // Only check sibling dependencies for "Outdated Deps" - ignore external dependencies
        if (Object.values(project_state.dependencies).some(dep => 
            dep.target[0] === 'found' && !dep.target[1]['dependency up to date']
        )) {
            issues.push('Outdated Deps');
        }

        const has_issues = issues.length > 0;

        projects.push({
            name: project_name,
            version: project_state.version,
            dependencies,
            has_issues,
            issues,
            is_name_synced: project_state['package name in sync with directory name'],
            has_unpushed_work: project_state.git['unpushed commits']
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
    
    // Project nodes (sibling repositories)
`;

    // Add project nodes
    for (const project of projects) {
        const node_id = safe_node_id(project.name);
        const version_display = project.version !== null ? project.version : 'n/a';
        const version_label = version_display === 'n/a' ? 'n/a' : `v${version_display}`;
        
        // Build label with issues
        let label = `${escape_dot_string(project.name)}<BR/>${version_label}`;
        if (project.issues.length > 0) {
            const issues_text = project.issues.join(', ');
            label += `<BR/><FONT COLOR="red">${escape_dot_string(issues_text)}</FONT>`;
        }

        // Determine node color
        let node_color: string;
        if (!project.is_name_synced) {
            node_color = 'orange'; // Name mismatch
        } else if (project.has_issues) {
            node_color = 'lightcoral'; // Has issues
        } else {
            node_color = 'lightblue'; // Healthy
        }

        // Add red border if there are unpushed commits
        const border_style = project.has_unpushed_work ? ', color=red, penwidth=3' : '';
        
        dot_content += `    ${node_id} [label=<${label}>, fillcolor=${node_color}${border_style}];\n`;
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

    // Add legend at the bottom
    if (include_legend) {
        dot_content += `
    // Legend (at bottom, compact vertical layout)
    subgraph cluster_legend {
        label="Legend";
        style=filled;
        color=lightgrey;
        
        node [shape=plaintext, fontsize=10];
        
        legend_nodes [label=<
            <TABLE BORDER="0" CELLBORDER="0" CELLSPACING="2">
            <TR><TD COLSPAN="2"><B>Node Types</B></TD></TR>
            <TR><TD BGCOLOR="lightblue" WIDTH="20"> </TD><TD ALIGN="LEFT">Healthy Project</TD></TR>
            <TR><TD BGCOLOR="lightcoral" WIDTH="20"> </TD><TD ALIGN="LEFT">Project with Issues</TD></TR>
            <TR><TD BGCOLOR="orange" WIDTH="20"> </TD><TD ALIGN="LEFT">Name Mismatch</TD></TR>
            <TR><TD BGCOLOR="lightblue" BORDER="3" COLOR="red" WIDTH="20"> </TD><TD ALIGN="LEFT">Unpushed Commits</TD></TR>
            <TR><TD BGCOLOR="yellow" WIDTH="20"> </TD><TD ALIGN="LEFT">External Package</TD></TR>
            <TR><TD COLSPAN="2"> </TD></TR>
            <TR><TD COLSPAN="2"><B>Edge Colors</B></TD></TR>
            <TR><TD COLOR="blue" WIDTH="20">━━━</TD><TD ALIGN="LEFT">Up to date</TD></TR>
            <TR><TD COLOR="yellow" WIDTH="20">━━━</TD><TD ALIGN="LEFT">Version behind</TD></TR>
            <TR><TD COLOR="red" WIDTH="20">━━━</TD><TD ALIGN="LEFT">Target has issues</TD></TR>
            </TABLE>
        >];
    }`;
    }

    dot_content += '}\n';

    return dot_content;
}