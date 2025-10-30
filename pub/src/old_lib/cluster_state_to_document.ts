import * as d_in from "../interface/package_state"
import { Document, Div, Table_Section, Table_Row, Span } from "../interface/html"

// Helper to create a simple text span
function textSpan(text: string, classes: string[] = [], title?: string): Span {
    return {
        classes,
        title,
        children: [{ classes: [], type: ['p', { text }] }]
    }
}

// Helper to create a link
function linkSpan(text: string, href: string, classes: string[] = []): Span {
    return {
        classes,
        children: [{ classes: [], type: ['a', { text, href }] }]
    }
}

// Helper to create a Div with a single span child
function divWithSpan(span: Span): Div {
    return {
        classes: [],
        children: [{ type: ['span', span] }]
    }
}

export function cluster_state_to_document(
    cluster_state: d_in.Cluster_State,
    options: {
        'time stamp': string
        'cluster path': string
    }
): Document {
    const cluster_path = options['cluster path']
    const time_stamp = options['time stamp']

    const css = `
        /* Professional Corporate Styling */
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }
        
        body {
            font-family: 'Segoe UI', 'Helvetica Neue', Arial, sans-serif;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            min-height: 100vh;
            padding: 40px 20px;
            color: #2d3748;
            line-height: 1.6;
        }
        
        .report-container {
            max-width: 1400px;
            margin: 0 auto;
            background: white;
            border-radius: 12px;
            box-shadow: 0 20px 60px rgba(0,0,0,0.3);
            overflow: hidden;
        }
        
        .report-header {
            background: linear-gradient(135deg, #2d3748 0%, #1a202c 100%);
            color: white;
            padding: 40px 50px;
            border-bottom: 4px solid #667eea;
        }
        
        .report-header > span {
            font-size: 2.5em;
            font-weight: 300;
            letter-spacing: -0.5px;
            margin-bottom: 20px;
            color: white;
            display: block;
        }
        
        .metadata {
            display: flex;
            gap: 40px;
            font-size: 0.95em;
            color: #cbd5e0;
            margin-top: 15px;
        }
        
        .metadata > div {
            display: flex;
            align-items: center;
        }
        
        .metadata > div::before {
            content: '▪';
            margin-right: 10px;
            color: #667eea;
            font-size: 1.5em;
        }
        
        .table-wrapper {
            padding: 50px;
            background: #f7fafc;
        }
        
        table {
            width: 100%;
            border-collapse: separate;
            border-spacing: 0;
            background: white;
            border-radius: 8px;
            overflow: hidden;
            box-shadow: 0 4px 6px rgba(0,0,0,0.07);
        }
        
        thead {
            background: linear-gradient(135deg, #4a5568 0%, #2d3748 100%);
            color: white;
        }
        
        th {
            padding: 18px 16px;
            text-align: left;
            font-weight: 600;
            font-size: 0.85em;
            text-transform: uppercase;
            letter-spacing: 0.5px;
            border-bottom: 3px solid #667eea;
            position: sticky;
            top: 0;
            z-index: 10;
        }
        
        td {
            padding: 16px;
            border-bottom: 1px solid #e2e8f0;
            font-size: 0.95em;
        }
        
        tbody tr {
            transition: all 0.2s ease;
        }
        
        tbody tr:hover {
            background: #edf2f7;
            transform: scale(1.001);
            box-shadow: 0 2px 8px rgba(0,0,0,0.08);
        }
        
        tbody tr:last-child td {
            border-bottom: none;
        }
        
        .package-name {
            font-weight: 600;
            font-size: 1.05em;
        }
        
        .package-name a {
            color: inherit;
            text-decoration: none;
            transition: all 0.2s ease;
            display: inline-flex;
            align-items: center;
        }
        
        .package-name a:hover {
            color: #667eea;
        }
        
        .package-name a::after {
            content: '→';
            margin-left: 6px;
            opacity: 0;
            transition: all 0.2s ease;
        }
        
        .package-name a:hover::after {
            opacity: 1;
            margin-left: 8px;
        }
        
        .package-name-ok {
            color: #38a169;
        }
        
        .package-name-warning {
            color: #dd6b20;
        }
        
        .package-name-error {
            color: #e53e3e;
        }
        
        .status-ok {
            color: #38a169;
            font-weight: 600;
        }
        
        .status-warning {
            color: #dd6b20;
            font-weight: 600;
        }
        
        .status-error {
            color: #e53e3e;
            font-weight: 600;
        }
        
        .status-skip {
            color: #a0aec0;
            font-style: italic;
        }
        
        .status-external {
            color: #718096;
        }
        
        .version {
            color: #718096;
            font-size: 0.9em;
            font-family: 'Courier New', monospace;
            background: #edf2f7;
            padding: 2px 8px;
            border-radius: 4px;
            display: inline-block;
        }
        
        span[title] {
            cursor: help;
            position: relative;
            border-bottom: 1px dotted #cbd5e0;
        }
        
        span[title]:hover {
            border-bottom-color: #667eea;
        }
        
        span[title]:hover::after {
            content: attr(title);
            position: absolute;
            left: 50%;
            transform: translateX(-50%);
            bottom: calc(100% + 10px);
            background: linear-gradient(135deg, #2d3748 0%, #1a202c 100%);
            color: white;
            padding: 12px 16px;
            border-radius: 8px;
            white-space: pre-wrap;
            z-index: 1000;
            font-size: 0.85em;
            box-shadow: 0 10px 25px rgba(0,0,0,0.3);
            max-width: 400px;
            text-align: left;
            line-height: 1.5;
            border: 1px solid #667eea;
            animation: tooltip-appear 0.2s ease;
        }
        
        span[title]:hover::before {
            content: '';
            position: absolute;
            left: 50%;
            transform: translateX(-50%);
            bottom: 100%;
            border: 6px solid transparent;
            border-top-color: #2d3748;
            z-index: 1001;
        }
        
        @keyframes tooltip-appear {
            from {
                opacity: 0;
                transform: translateX(-50%) translateY(5px);
            }
            to {
                opacity: 1;
                transform: translateX(-50%) translateY(0);
            }
        }
        
        /* Print styles for professional reports */
        @media print {
            body {
                background: white;
                padding: 0;
            }
            
            .report-container {
                box-shadow: none;
                border-radius: 0;
            }
            
            .report-header {
                background: #2d3748;
                -webkit-print-color-adjust: exact;
                print-color-adjust: exact;
            }
            
            tbody tr:hover {
                background: white;
                transform: none;
            }
        }
    `

    if (cluster_state[0] === 'not found') {
        return {
            css: `
                body { font-family: 'Segoe UI', Arial, sans-serif; margin: 40px; }
                h1 { color: #2d3748; }
            `,
            root: {
                classes: [],
                children: [{
                    type: ['div', {
                        classes: [],
                        children: [{
                            type: ['span', {
                                classes: [],
                                children: [{
                                    classes: [],
                                    type: ['p', { text: 'Cluster not found' }]
                                }]
                            }]
                        }]
                    }]
                }]
            }
        }
    }

    const cluster_data = cluster_state[1]
    const projects: Array<{ name: string; state: d_in.Package_State }> = []
    
    for (const [project_name, project_entry] of Object.entries(cluster_data.projects)) {
        if (project_entry[0] === 'project') {
            projects.push({ name: project_name, state: project_entry[1] })
        }
    }

    // Sort projects
    if (cluster_data['topological order'][0] === 'valid order') {
        const order = cluster_data['topological order'][1]
        const orderMap = new Map(order.map((n, i) => [n, i]))
        projects.sort((a, b) => {
            const oa = orderMap.get(a.name)
            const ob = orderMap.get(b.name)
            if (oa !== undefined && ob !== undefined) return oa - ob
            return a.name.localeCompare(b.name)
        })
    } else {
        projects.sort((a, b) => a.name.localeCompare(b.name))
    }

    // Build header row
    const headerRow: Table_Row = {
        classes: [],
        type: ['th', null],
        cells: ['Package', 'Version', 'Name Sync', 'Git Status', 'Structure', 'Int⟷Imp', 'Dependencies', 'Tests', 'Same as Published'].map(text => ({
            classes: [],
            div: divWithSpan(textSpan(text))
        }))
    }

    // Build body rows
    const bodyRows: Table_Row[] = projects.map(project => {
        const state = project.state
        const version = state.version !== null ? state.version : 'n/a'
        
        // Determine severity for package name coloring
        let worstSeverity: 'ok' | 'warning' | 'error' = 'ok'
        
        // Name sync
        const packageNameInJson = state['package name in package.json']
        const nameSyncOk = packageNameInJson === project.name
        if (!nameSyncOk) worstSeverity = 'error'
        
        const nameSyncSpan = nameSyncOk
            ? textSpan('✓', ['status-ok'], 'Package name matches directory name')
            : textSpan('✗ Mismatch', ['status-error'], `Package name in package.json: ${packageNameInJson}`)
        
        // Structure
        let structureSpan: Span
        if (state.structure[0] === 'valid') {
            const warnings = state.structure[1].warnings
            if (warnings.length > 0) {
                structureSpan = textSpan(`⚠ ${warnings.length} warning(s)`, ['status-warning'])
                if (worstSeverity === 'ok') worstSeverity = 'warning'
            } else {
                structureSpan = textSpan('✓', ['status-ok'])
            }
        } else {
            const errors = state.structure[1].errors
            structureSpan = textSpan(`✗ ${errors.length} error(s)`, ['status-error'])
            worstSeverity = 'error'
        }
        
        // Interface implementation match
        let intImpSpan: Span
        const iim = state['interface implementation match']
        if (iim[0] === 'matched') {
            intImpSpan = textSpan('✓', ['status-ok'])
        } else if (iim[0] === 'root interface direcory missing') {
            intImpSpan = textSpan('⚠ No Int', ['status-warning'], 'pub/src/interface/algorithms directory not found')
            if (worstSeverity === 'ok') worstSeverity = 'warning'
        } else if (iim[0] === 'root implementation direcory missing') {
            intImpSpan = textSpan('⚠ No Impl', ['status-warning'], 'pub/src/implementation/algorithms directory not found')
            if (worstSeverity === 'ok') worstSeverity = 'warning'
        } else {
            const diffs = iim[1].differences
            const missing = diffs.filter(d => d.problem[0] === 'missing')
            const superfluous = diffs.filter(d => d.problem[0] === 'superfluous')
            
            const parts: string[] = []
            if (missing.length > 0) {
                parts.push(`Missing in implementation (${missing.length}):`)
                parts.push(...missing.map(d => `  − ${d.path}`))
            }
            if (superfluous.length > 0) {
                if (parts.length > 0) parts.push('')
                parts.push(`Superfluous in implementation (${superfluous.length}):`)
                parts.push(...superfluous.map(d => `  + ${d.path}`))
            }
            
            intImpSpan = textSpan(`✗ ${diffs.length} issue(s)`, ['status-error'], parts.join('\n'))
            worstSeverity = 'error'
        }
        
        // Test
        let testSpan: Span
        if (state.test[0] === 'skipped') {
            testSpan = textSpan('Skipped', ['status-skip'])
        } else if (state.test[0] === 'success') {
            testSpan = textSpan('✓ Pass', ['status-ok'])
        } else {
            const failType = state.test[1][0]
            testSpan = textSpan(`✗ ${failType === 'build' ? 'Build' : 'Test'} failed`, ['status-error'])
            worstSeverity = 'error'
        }
        
        // Git status
        const hasDirtyTree = state.git['dirty working tree']
        const hasStagedFiles = state.git['staged files']
        const hasUnpushedCommits = state.git['unpushed commits']
        
        if (hasDirtyTree || hasStagedFiles || hasUnpushedCommits) {
            if (worstSeverity === 'ok') worstSeverity = 'warning'
        }
        
        const gitSpans: Span[] = [
            textSpan(hasDirtyTree ? 'Dirty' : '✓', hasDirtyTree ? ['status-warning'] : ['status-ok'], hasDirtyTree ? undefined : 'Working tree clean'),
            textSpan(hasStagedFiles ? 'Staged' : '✓', hasStagedFiles ? ['status-warning'] : ['status-ok'], hasStagedFiles ? undefined : 'No staged files'),
            textSpan(hasUnpushedCommits ? 'Unpushed' : '✓', hasUnpushedCommits ? ['status-warning'] : ['status-ok'], hasUnpushedCommits ? undefined : 'All commits pushed')
        ]
        const gitSpan: Span = { 
            classes: [], 
            children: gitSpans.flatMap((s, i) => {
                const separator: { classes: string[]; type: ['p', { text: string }] } = { classes: [], type: ['p', { text: ' ' }] }
                return [...s.children, ...(i < gitSpans.length - 1 ? [separator] : [])]
            })
        }
        
        // Dependencies
        const deps = Object.entries(state.dependencies)
        const outdatedDeps = deps.filter(([_, dep]) => dep.target[0] === 'found' && !dep.target[1]['dependency up to date'])
        const externalDeps = deps.filter(([_, dep]) => dep.target[0] === 'not found')
        const upToDateDeps = deps.filter(([_, dep]) => dep.target[0] === 'found' && dep.target[1]['dependency up to date'])
        
        if (outdatedDeps.length > 0 && worstSeverity === 'ok') worstSeverity = 'warning'
        
        let depsSpan: Span
        if (deps.length === 0) {
            depsSpan = textSpan('None', ['status-skip'])
        } else {
            const parts: Span[] = []
            if (outdatedDeps.length > 0) {
                parts.push(textSpan(`Behind (${outdatedDeps.length})`, ['status-warning'], outdatedDeps.map(([n]) => n).join(', ')))
            }
            if (upToDateDeps.length > 0) {
                parts.push(textSpan(`At latest (${upToDateDeps.length})`, ['status-ok'], upToDateDeps.map(([n]) => n).join(', ')))
            }
            if (externalDeps.length > 0) {
                parts.push(textSpan(`External (${externalDeps.length})`, ['status-external'], externalDeps.map(([n]) => n).join(', ')))
            }
            depsSpan = { 
                classes: [], 
                children: parts.flatMap((s, i) => {
                    const separator: { classes: string[]; type: ['p', { text: string }] } = { classes: [], type: ['p', { text: ' ' }] }
                    return [...s.children, ...(i < parts.length - 1 ? [separator] : [])]
                })
            }
        }
        
        // Published
        let publishedSpan: Span
        if (state['published comparison'][0] === 'skipped') {
            publishedSpan = textSpan('Not tested', ['status-skip'])
        } else if (state['published comparison'][0] === 'could not compare') {
            const reason = state['published comparison'][1][0]
            publishedSpan = textSpan(reason.replace(/-/g, ' '), ['status-skip'])
        } else {
            const comparison = state['published comparison'][1][0]
            if (comparison === 'identical') {
                publishedSpan = textSpan('✓ In sync', ['status-ok'])
            } else {
                publishedSpan = textSpan('Different', ['status-warning'])
                if (worstSeverity === 'ok') worstSeverity = 'warning'
            }
        }
        
        // Package name (with link and color)
        const packagePath = `${cluster_path}/${project.name}`
        const vscodeUrl = `vscode://file${packagePath}`
        const packageNameSpan = linkSpan(project.name, vscodeUrl, ['package-name', `package-name-${worstSeverity}`])
        
        return {
            classes: [],
            type: ['td' as const, null],
            cells: [
                { classes: [], div: divWithSpan(packageNameSpan) },
                { classes: [], div: divWithSpan(textSpan(version, ['version'])) },
                { classes: [], div: divWithSpan(nameSyncSpan) },
                { classes: [], div: divWithSpan(gitSpan) },
                { classes: [], div: divWithSpan(structureSpan) },
                { classes: [], div: divWithSpan(intImpSpan) },
                { classes: [], div: divWithSpan(depsSpan) },
                { classes: [], div: divWithSpan(testSpan) },
                { classes: [], div: divWithSpan(publishedSpan) }
            ]
        }
    })

    return {
        css,
        root: {
            classes: ['report-container'],
            children: [
                {
                    type: ['div', {
                        classes: ['report-header'],
                        children: [
                            {
                                type: ['span', {
                                    classes: [],
                                    children: [{
                                        classes: [],
                                        type: ['p', { text: 'Cluster Status Report' }]
                                    }]
                                }]
                            },
                            {
                                type: ['div', {
                                    classes: ['metadata'],
                                    children: [
                                        {
                                            type: ['div', {
                                                classes: [],
                                                children: [{
                                                    type: ['span', {
                                                        classes: [],
                                                        children: [{
                                                            classes: [],
                                                            type: ['p', { text: `Cluster: ${cluster_path}` }]
                                                        }]
                                                    }]
                                                }]
                                            }]
                                        },
                                        {
                                            type: ['div', {
                                                classes: [],
                                                children: [{
                                                    type: ['span', {
                                                        classes: [],
                                                        children: [{
                                                            classes: [],
                                                            type: ['p', { text: `Generated: ${time_stamp}` }]
                                                        }]
                                                    }]
                                                }]
                                            }]
                                        }
                                    ]
                                }]
                            }]
                    }]
                },
                {
                    type: ['div', {
                        classes: ['table-wrapper'],
                        children: [{
                            type: ['table', {
                                classes: [],
                                children: [
                                    { classes: [], type: ['header', null], rows: [headerRow] },
                                    { classes: [], type: ['body', null], rows: bodyRows }
                                ]
                            }]
                        }]
                    }]
                }
            ]
        }
    }
}

export default cluster_state_to_document
