import * as d_in from "../interface/package_state"

/**
 * Convert Project_Cluster_State to HTML table format
 * @param cluster_state - The project cluster state
 * @param options - Configuration options
 * @returns HTML content as string
 */
export function cluster_state_to_html(
    cluster_state: d_in.Cluster_State,
    options: {
        'time stamp': string
        'cluster path': string
    }
): string {
    const time_stamp = options['time stamp'];
    const cluster_path = options['cluster path'];

    // Handle 'not found' case
    if (cluster_state[0] === 'not found') {
        return `<!DOCTYPE html>
<html>
<head>
    <title>Cluster not found</title>
</head>
<body>
    <h1>Cluster not found</h1>
</body>
</html>`;
    }

    // Extract the cluster data
    const cluster_data = cluster_state[1];

    // Collect all projects
    const projects: Array<{
        name: string
        state: d_in.Package_State
    }> = [];

    for (const [project_name, project_entry] of Object.entries(cluster_data.projects)) {
        if (project_entry[0] === 'project') {
            projects.push({
                name: project_name,
                state: project_entry[1]
            });
        }
    }

    // Sort projects topologically if available, otherwise alphabetically
    if (cluster_data['topological order'][0] === 'valid order') {
        const order = cluster_data['topological order'][1];
        const orderMap = new Map(order.map((name, index) => [name, index]));
        projects.sort((a, b) => {
            const orderA = orderMap.get(a.name);
            const orderB = orderMap.get(b.name);
            if (orderA !== undefined && orderB !== undefined) {
                return orderA - orderB;
            }
            // If not in order, sort alphabetically
            return a.name.localeCompare(b.name);
        });
    } else {
        // Circular dependencies or no order available - sort alphabetically
        projects.sort((a, b) => a.name.localeCompare(b.name));
    }

    // Generate HTML
    let html = `<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <title>Cluster Status Report - ${escapeHtml(cluster_path)}</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            margin: 20px;
            background-color: #f5f5f5;
        }
        h1 {
            color: #333;
        }
        .metadata {
            color: #666;
            font-size: 0.9em;
            margin-bottom: 20px;
        }
        table {
            border-collapse: collapse;
            width: 100%;
            background-color: white;
            box-shadow: 0 2px 4px rgba(0,0,0,0.1);
        }
        th, td {
            border: 1px solid #ddd;
            padding: 12px;
            text-align: left;
        }
        th {
            background-color: #4CAF50;
            color: white;
            font-weight: bold;
            position: sticky;
            top: 0;
        }
        tr:nth-child(even) {
            background-color: #f9f9f9;
        }
        tr:hover {
            background-color: #f5f5f5;
        }
        .package-name {
            font-weight: bold;
            color: #2196F3;
        }
        .status-ok {
            color: green;
            font-weight: bold;
        }
        .status-warning {
            color: orange;
            font-weight: bold;
        }
        .status-error {
            color: red;
            font-weight: bold;
        }
        .status-skip {
            color: gray;
        }
        .status-external {
            color: gray;
        }
        .version {
            color: #666;
            font-size: 0.9em;
        }
        span[title] {
            cursor: help;
            position: relative;
        }
        span[title]:hover::after {
            content: attr(title);
            position: absolute;
            left: 50%;
            transform: translateX(-50%);
            bottom: 100%;
            margin-bottom: 5px;
            padding: 8px 12px;
            background-color: #333;
            color: white;
            border-radius: 4px;
            white-space: nowrap;
            z-index: 1000;
            font-size: 0.85em;
            box-shadow: 0 2px 8px rgba(0,0,0,0.2);
        }
    </style>
</head>
<body>
    <h1>Cluster Status Report</h1>
    <div class="metadata">
        <div>Cluster: ${escapeHtml(cluster_path)}</div>
        <div>Generated: ${escapeHtml(time_stamp)}</div>
        <div>Total Projects: ${projects.length}</div>
    </div>
    <table>
        <thead>
            <tr>
                <th>Package</th>
                <th>Version</th>
                <th>Name Sync</th>
                <th>Git Status</th>
                <th>Structure</th>
                <th>Dependencies</th>
                <th>Tests</th>
                <th>Same as Published</th>
            </tr>
        </thead>
        <tbody>
`;

    // Add rows for each project
    for (const project of projects) {
        const state = project.state;
        
        // Version
        const version = state.version !== null ? state.version : 'n/a';
        
        // Name sync status
        const packageNameInJson = state['package name in package.json'];
        const nameSync = packageNameInJson === project.name
            ? '<span class="status-ok" title="Package name matches directory name">✓</span>'
            : `<span class="status-error" title="Package name in package.json: ${escapeHtml(packageNameInJson)}">✗ Mismatch</span>`;
        
        // Structure status
        let structureStatus: string;
        if (state.structure[0] === 'valid') {
            const warnings = state.structure[1].warnings;
            if (warnings.length > 0) {
                structureStatus = `<span class="status-warning">⚠ ${warnings.length} warning(s)</span>`;
            } else {
                structureStatus = '<span class="status-ok">✓</span>';
            }
        } else {
            const errors = state.structure[1].errors;
            structureStatus = `<span class="status-error">✗ ${errors.length} error(s)</span>`;
        }
        
        // Test status
        let testStatus: string;
        if (state.test[0] === 'skipped') {
            testStatus = '<span class="status-skip">Skipped</span>';
        } else if (state.test[0] === 'success') {
            testStatus = '<span class="status-ok">✓ Pass</span>';
        } else {
            const failType = state.test[1][0];
            testStatus = `<span class="status-error">✗ ${failType === 'build' ? 'Build' : 'Test'} failed</span>`;
        }
        
        // Git status - show individual issues in order: working tree clean, no staged changes, all commits pushed
        const gitStatuses: string[] = [];
        gitStatuses.push(state.git['dirty working tree'] 
            ? '<span class="status-warning">Dirty</span>' 
            : '<span class="status-ok" title="Working tree clean">✓</span>');
        gitStatuses.push(state.git['staged files'] 
            ? '<span class="status-warning">Staged</span>' 
            : '<span class="status-ok" title="No staged files">✓</span>');
        gitStatuses.push(state.git['unpushed commits'] 
            ? '<span class="status-warning">Unpushed</span>' 
            : '<span class="status-ok" title="All commits pushed">✓</span>');
        
        const gitStatus = gitStatuses.join(' ');
        
        // Dependencies status - show 'at latest' or 'behind' with tooltips
        const deps = Object.entries(state.dependencies);
        const outdatedDeps = deps.filter(([_, dep]) => 
            dep.target[0] === 'found' && !dep.target[1]['dependency up to date']
        );
        const externalDeps = deps.filter(([_, dep]) => dep.target[0] === 'not found');
        const upToDateDeps = deps.filter(([_, dep]) => 
            dep.target[0] === 'found' && dep.target[1]['dependency up to date']
        );
        
        let depsStatus: string;
        if (deps.length === 0) {
            depsStatus = '<span class="status-skip">None</span>';
        } else if (outdatedDeps.length > 0 || externalDeps.length > 0) {
            const parts: string[] = [];
            if (outdatedDeps.length > 0) {
                const outdatedNames = outdatedDeps.map(([name]) => escapeHtml(name)).join(', ');
                parts.push(`<span class="status-warning" title="${outdatedNames}">Behind (${outdatedDeps.length})</span>`);
            }
            if (upToDateDeps.length > 0) {
                const upToDateNames = upToDateDeps.map(([name]) => escapeHtml(name)).join(', ');
                parts.push(`<span class="status-ok" title="${upToDateNames}">At latest (${upToDateDeps.length})</span>`);
            }
            if (externalDeps.length > 0) {
                const externalNames = externalDeps.map(([name]) => escapeHtml(name)).join(', ');
                parts.push(`<span class="status-external" title="${externalNames}">External (${externalDeps.length})</span>`);
            }
            depsStatus = parts.join(' ');
        } else {
            const upToDateNames = upToDateDeps.map(([name]) => escapeHtml(name)).join(', ');
            depsStatus = `<span class="status-ok" title="${upToDateNames}">At latest (${deps.length})</span>`;
        }
        
        // Published comparison status
        let publishedStatus: string;
        if (state['published comparison'][0] === 'skipped') {
            publishedStatus = '<span class="status-skip">Not tested</span>';
        } else if (state['published comparison'][0] === 'could not compare') {
            const reason = state['published comparison'][1][0];
            publishedStatus = `<span class="status-skip">${reason.replace(/-/g, ' ')}</span>`;
        } else {
            const comparison = state['published comparison'][1][0];
            if (comparison === 'identical') {
                publishedStatus = '<span class="status-ok">✓ In sync</span>';
            } else {
                publishedStatus = '<span class="status-warning">Different</span>';
            }
        }
        
        html += `            <tr>
                <td class="package-name">${escapeHtml(project.name)}</td>
                <td class="version">${escapeHtml(version)}</td>
                <td>${nameSync}</td>
                <td>${gitStatus}</td>
                <td>${structureStatus}</td>
                <td>${depsStatus}</td>
                <td>${testStatus}</td>
                <td>${publishedStatus}</td>
            </tr>
`;
    }

    html += `        </tbody>
    </table>
</body>
</html>
`;

    return html;
}

function escapeHtml(str: string): string {
    return str
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#039;');
}
