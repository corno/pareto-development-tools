/**
 * Cluster Analysis Command
 * 
 * Analyzes all package repositories in a cluster directory and displays results with color-coded output.
 * 
 * Usage: pareto cluster analyse [options] [cluster-directory]
 * 
 * The cluster directory should contain multiple package repository subdirectories.
 * Each package repository should have the structure:
 *   <cluster>/
 *   ├── package-1/
 *   │   ├── pub/
 *   │   │   └── package.json
 *   │   └── test/
 *   ├── package-2/
 *   │   ├── pub/
 *   │   │   └── package.json
 *   │   └── test/
 *   └── ...
 * 
 * Example: pareto cluster analyse /path/to/my-cluster
 */

import * as fs from 'fs'
import * as path from 'path'
import { execSync } from 'child_process'
import { $$ as analyse_cluster } from '../../queries/analyse_cluster'
import { package_state_to_analysis_result } from '../../transformations/state_to_analysis_result'
import { project_cluster_state_to_dot } from '../../old_lib/project_cluster_state_to_dot'
import { dot_to_svg } from '../../old_lib/dot_to_svg'
import { cluster_state_to_html } from '../../old_lib/cluster_state_to_html'
import type { Package_Analysis_Result, Cluster_Analysis_Result } from '../../interface/analysis_result'

    function getStatusColor(status: string): string {
        switch (status) {
            case 'success': return '\x1b[32m'  // Green
            case 'issue': return '\x1b[31m'    // Red
            case 'warning': return '\x1b[33m'  // Yellow
            case 'unknown': return '\x1b[90m'  // Gray
            default: return '\x1b[0m'
        }
    }

function resetColor(): string {
    return '\x1b[0m'
}

function printAnalysisResult(result: Package_Analysis_Result, depth: number = 0, category?: string): void {
    const indent = '  '.repeat(depth)
    const reset = resetColor()
    
    if (result[0] === 'leaf') {
        // Leaf node - show category and outcome with status color
        const color = getStatusColor(result[1].status[0])
        const displayCategory = category || 'result'
        console.log(`${indent}${color}${displayCategory}: ${result[1].outcome}${reset}`)
    } else {
        // Composite node - show category with colored prefix icon, but use default text color
        const getCompositeStatus = (compositeResult: Package_Analysis_Result): string => {
            if (compositeResult[0] === 'leaf') {
                return compositeResult[1].status[0]
            } else {
                const childStatuses = Object.values(compositeResult[1]).map(child => getCompositeStatus(child))
                if (childStatuses.some(s => s === 'issue')) return 'issue'
                if (childStatuses.some(s => s === 'warning')) return 'warning'
                if (childStatuses.some(s => s === 'unknown')) return 'unknown'
                return 'success'
            }
        }
        
        const status = getCompositeStatus(result)
        const iconColor = getStatusColor(status)
        const icon = status === 'issue' ? '✗' : status === 'warning' ? '⚠' : status === 'unknown' ? '?' : '✓'
        const displayCategory = category || 'composite'
        
        // Use colored icon, then explicitly reset to default for text
        console.log(`${indent}${iconColor}${icon}\x1b[0m ${displayCategory}`)
        
        // Print children with increased indentation
        for (const [childCategory, child] of Object.entries(result[1])) {
            printAnalysisResult(child, depth + 1, childCategory)
        }
    }
}

function printClusterAnalysis(cluster_result: Cluster_Analysis_Result): void {
    const project_names = Object.keys(cluster_result).sort()
    
    // Helper function to get status from Package_Analysis_Result
    const getOverallStatus = (result: Package_Analysis_Result): string => {
        if (result[0] === 'leaf') {
            return result[1].status[0]
        } else {
            const childStatuses = Object.values(result[1]).map(child => getOverallStatus(child))
            if (childStatuses.some(s => s === 'issue')) return 'issue'
            if (childStatuses.some(s => s === 'warning')) return 'warning'
            if (childStatuses.some(s => s === 'unknown')) return 'unknown'
            return 'success'
        }
    }
    
    for (const project_name of project_names) {
        const project_result = cluster_result[project_name]
        const status = getOverallStatus(project_result)
        const color = getStatusColor(status)
        const reset = resetColor()
        
        console.log(`\n${color}📦 ${project_name}${reset}`)
        console.log('─'.repeat(60))
        
        // Print the analysis details
        printAnalysisResult(project_result, 1, 'package')
    }
}

function showHelp(): void {
    console.log(`
Cluster Analysis Tool

Usage: 
  pareto cluster analyse [options] <cluster-directory>

Options:
  --help                Show this help message
  --pre-publish         Pre-publish analysis for all packages
  --pre-commit          Pre-commit analysis for all packages
  --structural          Structural analysis only for all packages
  --graph               Generate dependency graph (SVG) and open in viewer
  --table               Generate HTML table report and open in viewer

Analysis levels (from most comprehensive to fastest):
  • (no flag): Complete package state analysis for all packages (default)
  • --pre-publish: Pre-publish checks for all packages
  • --pre-commit: Pre-commit checks for all packages
  • --structural: Structure validation only for all packages

Arguments:
  cluster-directory   Path to cluster directory (required)
                     Expected structure: <path>/<package>/pub/package.json

Examples:
  pareto cluster analyse /path/to/cluster                 # Full analysis (default)
  pareto cluster analyse /path/to/cluster --structural    # Fast structural check only
  pareto cluster analyse /path/to/cluster --pre-commit    # Pre-commit validation
  pareto cluster analyse /path/to/cluster --pre-publish   # Pre-publish validation
  pareto cluster analyse /path/to/cluster --graph         # Generate and view dependency graph
  pareto cluster analyse /path/to/cluster --table         # Generate and view HTML table report
  pareto cluster analyse /path/to/cluster --graph --table # Generate both graph and table
`)
}

function openInViewer(filePath: string): void {
    try {
        // Try different commands to open the file based on the platform
        const platform = process.platform
        
        if (platform === 'darwin') {
            // macOS
            execSync(`open "${filePath}"`, { stdio: 'ignore' })
        } else if (platform === 'win32') {
            // Windows
            execSync(`start "" "${filePath}"`, { stdio: 'ignore' })
        } else {
            // Linux and others - try multiple approaches to avoid snap issues
            const fileExtension = filePath.toLowerCase().split('.').pop()
            
            if (fileExtension === 'svg') {
                // For SVG files, try multiple viewers in order of preference
                const svgViewers = [
                    'inkscape',           // Inkscape (if installed)
                    'firefox',            // Firefox can view SVG files
                    'chromium-browser',   // Chromium
                    'google-chrome',      // Chrome
                    'eog',               // Eye of GNOME (might be snap)
                    'xviewer'            // Alternative image viewer
                ]
                
                let opened = false
                for (const viewer of svgViewers) {
                    try {
                        execSync(`which ${viewer}`, { stdio: 'pipe' })
                        execSync(`${viewer} "${filePath}" &`, { stdio: 'ignore' })
                        opened = true
                        break
                    } catch {
                        // Try next viewer
                        continue
                    }
                }
                
                if (!opened) {
                    // Last resort: try xdg-open
                    try {
                        execSync(`xdg-open "${filePath}"`, { stdio: 'ignore' })
                        opened = true
                    } catch {
                        // Still failed
                    }
                }
                
                if (!opened) {
                    console.log(`📁 Generated file: ${filePath}`)
                    console.log('   (Could not open automatically - please open manually with: firefox, inkscape, or any SVG viewer)')
                }
            } else if (fileExtension === 'html') {
                // For HTML files, try browsers
                const browsers = [
                    'firefox',
                    'chromium-browser',
                    'google-chrome',
                    'opera'
                ]
                
                let opened = false
                for (const browser of browsers) {
                    try {
                        execSync(`which ${browser}`, { stdio: 'pipe' })
                        execSync(`${browser} "${filePath}" &`, { stdio: 'ignore' })
                        opened = true
                        break
                    } catch {
                        // Try next browser
                        continue
                    }
                }
                
                if (!opened) {
                    // Last resort: try xdg-open
                    try {
                        execSync(`xdg-open "${filePath}"`, { stdio: 'ignore' })
                        opened = true
                    } catch {
                        // Still failed
                    }
                }
                
                if (!opened) {
                    console.log(`📁 Generated file: ${filePath}`)
                    console.log('   (Could not open automatically - please open manually with: firefox or any web browser)')
                }
            } else {
                // For other files, try xdg-open
                try {
                    execSync(`xdg-open "${filePath}"`, { stdio: 'ignore' })
                } catch {
                    console.log(`📁 Generated file: ${filePath}`)
                    console.log('   (Could not open automatically - please open manually)')
                }
            }
        }
    } catch (error) {
        console.log(`📁 Generated file: ${filePath}`)
        console.log('   (Could not open automatically - please open manually)')
    }
}

export const $$ = async (args: string[]): Promise<void> => {
    // Check for help flag
    if (args.includes('--help') || args.includes('-h')) {
        showHelp()
        process.exit(0)
    }
    
    // Parse analysis level flags - removed --all flag, default is full analysis
    const pre_publish_analysis = args.includes('--pre-publish')
    const pre_commit_analysis = args.includes('--pre-commit')
    const structural_analysis = args.includes('--structural')
    const generate_graph = args.includes('--graph')
    const generate_table = args.includes('--table')
    
    // Validate that only one analysis level is specified
    const analysis_flags = [pre_publish_analysis, pre_commit_analysis, structural_analysis].filter(Boolean)
    if (analysis_flags.length > 1) {
        console.error('Error: Please specify only one analysis level (--pre-publish, --pre-commit, or --structural)')
        process.exit(1)
    }
    
    // If no analysis flags specified, inform user about available options
    if (analysis_flags.length === 0) {
        console.log('Running full cluster analysis (all checks for all packages)...')
        console.log('Available analysis levels:')
        console.log('  --structural   : Structure validation only for all packages (fastest)')
        console.log('  --pre-commit   : Build, test, and structure validation for all packages')
        console.log('  --pre-publish  : All pre-commit checks plus git state, dependencies, and published comparison for all packages')
        console.log('  (no flag)      : Complete package analysis for all packages (default)')
        console.log('Additional options:')
        console.log('  --graph        : Generate dependency graph (SVG) and open in viewer')
        console.log('  --table        : Generate HTML table report and open in viewer')
        console.log('')
    }
    
    // Get cluster directory (non-flag arguments) - path is required
    const non_flag_args = args.filter(arg => !arg.startsWith('--'))
    if (non_flag_args.length === 0) {
        console.error('Error: Cluster directory path is required')
        console.error('Usage: pareto cluster analyse [options] <cluster-directory>')
        console.error('Expected structure: <cluster-path>/<package>/pub/package.json')
        process.exit(1)
    }
    
    const cluster_dir = path.resolve(non_flag_args[0])
    
    try {
        console.log(`Analyzing cluster: ${path.basename(cluster_dir)}`)
        console.log('='.repeat(60))
        
        // Analyze cluster state
        const cluster_state = analyse_cluster({
            'cluster path': cluster_dir
        })
        
        // Check if it's actually a cluster
        if (cluster_state[0] !== 'cluster') {
            console.error(`Error: Directory is not a valid cluster: ${cluster_dir}`)
            process.exit(1)
        }
        
        // Transform each project to analysis result
        const cluster_analysis: Cluster_Analysis_Result = {}
        let overall_has_issue = false
        let overall_has_warning = false
        let overall_has_unknown = false
        
        for (const [project_name, project_data] of Object.entries(cluster_state[1].projects)) {
            if (project_data[0] === 'project') {
                const package_state = project_data[1]
                const analysis_result = package_state_to_analysis_result(package_state)
                cluster_analysis[project_name] = analysis_result
                
                // Helper function to get status from Package_Analysis_Result
                const getOverallStatus = (result: Package_Analysis_Result): string => {
                    if (result[0] === 'leaf') {
                        return result[1].status[0]
                    } else {
                        const childStatuses = Object.values(result[1]).map(child => getOverallStatus(child))
                        if (childStatuses.some(s => s === 'issue')) return 'issue'
                        if (childStatuses.some(s => s === 'warning')) return 'warning'
                        if (childStatuses.some(s => s === 'unknown')) return 'unknown'
                        return 'success'
                    }
                }
                
                // Track overall status
                const status = getOverallStatus(analysis_result)
                if (status === 'issue') {
                    overall_has_issue = true
                } else if (status === 'warning') {
                    overall_has_warning = true
                } else if (status === 'unknown') {
                    overall_has_unknown = true
                }
            } else {
                // Not a project
                cluster_analysis[project_name] = ['leaf', {
                    'outcome': 'not a project',
                    'status': ['warning', null]
                }]
                overall_has_warning = true
            }
        }
        
        // Print colored cluster analysis
        printClusterAnalysis(cluster_analysis)
        
        console.log('\n' + '='.repeat(60))
        
        // Helper function to get status from Package_Analysis_Result
        const getOverallStatus = (result: Package_Analysis_Result): string => {
            if (result[0] === 'leaf') {
                return result[1].status[0]
            } else {
                const childStatuses = Object.values(result[1]).map(child => getOverallStatus(child))
                if (childStatuses.some(s => s === 'issue')) return 'issue'
                if (childStatuses.some(s => s === 'warning')) return 'warning'
                if (childStatuses.some(s => s === 'unknown')) return 'unknown'
                return 'success'
            }
        }
        
        // Summary
        const total_projects = Object.keys(cluster_analysis).length
        const issue_count = Object.values(cluster_analysis).filter(p => getOverallStatus(p) === 'issue').length
        const warning_count = Object.values(cluster_analysis).filter(p => getOverallStatus(p) === 'warning').length
        const unknown_count = Object.values(cluster_analysis).filter(p => getOverallStatus(p) === 'unknown').length
        const success_count = Object.values(cluster_analysis).filter(p => getOverallStatus(p) === 'success').length
        
        console.log(`Summary: ${total_projects} project(s)`)
        console.log(`${getStatusColor('success')}✓ ${success_count} successful${resetColor()}`)
        if (warning_count > 0) {
            console.log(`${getStatusColor('warning')}⚠ ${warning_count} with warnings${resetColor()}`)
        }
        if (unknown_count > 0) {
            console.log(`${getStatusColor('unknown')}? ${unknown_count} with unknown status${resetColor()}`)
        }
        if (issue_count > 0) {
            console.log(`${getStatusColor('issue')}✗ ${issue_count} with issues${resetColor()}`)
        }
        
        console.log('='.repeat(60))
        
        // Generate graph and/or table if requested
        if (generate_graph || generate_table) {
            console.log('')
            
            if (generate_graph) {
                try {
                    console.log('🔄 Generating dependency graph...')
                    const dot_content = project_cluster_state_to_dot(cluster_state, {
                        include_legend: true,
                        cluster_path: path.basename(cluster_dir),
                        show_warnings: false,
                        'time stamp': new Date().toISOString()
                    })
                    
                    const svg_content = dot_to_svg(dot_content)
                    const graph_filename = `${path.basename(cluster_dir)}-dependency-graph.svg`
                    const graph_path = path.join(process.cwd(), graph_filename)
                    
                    fs.writeFileSync(graph_path, svg_content)
                    console.log(`✅ Dependency graph generated: ${graph_filename}`)
                    
                    // Open in viewer
                    openInViewer(graph_path)
                } catch (error) {
                    console.error(`${getStatusColor('issue')}✗ Failed to generate dependency graph: ${error}${resetColor()}`)
                }
            }
            
            if (generate_table) {
                try {
                    console.log('🔄 Generating HTML table report...')
                    const html_content = cluster_state_to_html(cluster_state, {
                        'time stamp': new Date().toISOString(),
                        'cluster path': path.basename(cluster_dir)
                    })
                    
                    const table_filename = `${path.basename(cluster_dir)}-analysis-report.html`
                    const table_path = path.join(process.cwd(), table_filename)
                    
                    fs.writeFileSync(table_path, html_content)
                    console.log(`✅ HTML table report generated: ${table_filename}`)
                    
                    // Open in viewer
                    openInViewer(table_path)
                } catch (error) {
                    console.error(`${getStatusColor('issue')}✗ Failed to generate HTML table report: ${error}${resetColor()}`)
                }
            }
            
            console.log('')
        }
        
        // Exit with appropriate code based on overall status
        if (issue_count > 0) {
            console.log(`${getStatusColor('issue')}✗ Cluster analysis complete: Has issues${resetColor()}`)
            process.exit(1)
        } else if (overall_has_warning) {
            console.log(`${getStatusColor('warning')}⚠ Cluster analysis complete: Has warnings${resetColor()}`)
            process.exit(0)
        } else if (overall_has_unknown) {
            console.log(`${getStatusColor('unknown')}? Cluster analysis complete: Unknown status (some checks skipped)${resetColor()}`)
            process.exit(0)
        } else {
            console.log(`${getStatusColor('success')}✓ Cluster analysis complete: All checks passed${resetColor()}`)
            process.exit(0)
        }
        
    } catch (error) {
        console.error(`Error analyzing cluster: ${error}`)
        process.exit(1)
    }
}