#!/usr/bin/env node
/**
 * Cluster Analysis Command
 * 
 * Analyzes all package repositories in a cluster directory and displays results with color-coded output.
 * 
 * Usage: pareto cluster analyse <cluster-directory>
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
import { $$ as analyse_cluster } from '../../queries/analyse_cluster'
import { $$ as package_state_to_analysis_result } from '../../transformations/package_state_to_analysis_result'
import type { Package_Analysis_Result, Cluster_Analysis_Result } from '../../interface/analysis_result'

function getStatusColor(status: Package_Analysis_Result['status'][0]): string {
    switch (status) {
        case 'success': return '\x1b[32m' // green
        case 'warning': return '\x1b[33m' // yellow  
        case 'error': return '\x1b[31m'   // red
        case 'unknown': return '\x1b[90m' // grey
        default: return '\x1b[0m'         // reset
    }
}

function resetColor(): string {
    return '\x1b[0m'
}

function printAnalysisResult(result: Package_Analysis_Result, depth: number = 0): void {
    const indent = '  '.repeat(depth)
    const color = getStatusColor(result.status[0])
    const reset = resetColor()
    
    console.log(`${indent}${color}${result.category}: ${result.outcome}${reset}`)
    
    // Print children with increased indentation
    for (const child of result.children) {
        printAnalysisResult(child, depth + 1)
    }
}

function printClusterAnalysis(cluster_result: Cluster_Analysis_Result): void {
    const project_names = Object.keys(cluster_result).sort()
    
    for (const project_name of project_names) {
        const project_result = cluster_result[project_name]
        const color = getStatusColor(project_result.status[0])
        const reset = resetColor()
        
        console.log(`\n${color}📦 ${project_name}: ${project_result.outcome}${reset}`)
        console.log('─'.repeat(60))
        
        // Print the analysis details
        for (const child of project_result.children) {
            printAnalysisResult(child, 1)
        }
    }
}

export const $$ = (): void => {
    // Get cluster directory from command line argument or current directory
    const args = process.argv.slice(2)
    const cluster_dir = args.length > 0 ? path.resolve(args[0]) : process.cwd()
    
    try {
        console.log(`Analyzing cluster: ${path.basename(cluster_dir)}`)
        console.log('='.repeat(60))
        
        // Analyze cluster state (analysis-only, no building/testing)
        const cluster_state = analyse_cluster({
            'cluster path': cluster_dir,
            'build and test': false,  // Analysis should be read-only
            'compare to published': true
        })
        
        // Check if it's actually a cluster
        if (cluster_state[0] !== 'cluster') {
            console.error(`Error: Directory is not a valid cluster: ${cluster_dir}`)
            process.exit(1)
        }
        
        // Transform each project to analysis result
        const cluster_analysis: Cluster_Analysis_Result = {}
        let overall_has_error = false
        let overall_has_warning = false
        let overall_has_unknown = false
        
        for (const [project_name, project_data] of Object.entries(cluster_state[1].projects)) {
            if (project_data[0] === 'project') {
                const package_state = project_data[1]
                const analysis_result = package_state_to_analysis_result(package_state)
                cluster_analysis[project_name] = analysis_result
                
                // Track overall status
                if (analysis_result.status[0] === 'error') {
                    overall_has_error = true
                } else if (analysis_result.status[0] === 'warning') {
                    overall_has_warning = true
                } else if (analysis_result.status[0] === 'unknown') {
                    overall_has_unknown = true
                }
            } else {
                // Not a project
                cluster_analysis[project_name] = {
                    'category': 'project',
                    'outcome': 'not a project',
                    'status': ['warning', null],
                    'children': []
                }
                overall_has_warning = true
            }
        }
        
        // Print colored cluster analysis
        printClusterAnalysis(cluster_analysis)
        
        console.log('\n' + '='.repeat(60))
        
        // Summary
        const total_projects = Object.keys(cluster_analysis).length
        const error_count = Object.values(cluster_analysis).filter(p => p.status[0] === 'error').length
        const warning_count = Object.values(cluster_analysis).filter(p => p.status[0] === 'warning').length
        const unknown_count = Object.values(cluster_analysis).filter(p => p.status[0] === 'unknown').length
        const success_count = Object.values(cluster_analysis).filter(p => p.status[0] === 'success').length
        
        console.log(`Summary: ${total_projects} project(s)`)
        console.log(`${getStatusColor('success')}✓ ${success_count} successful${resetColor()}`)
        if (warning_count > 0) {
            console.log(`${getStatusColor('warning')}⚠ ${warning_count} with warnings${resetColor()}`)
        }
        if (unknown_count > 0) {
            console.log(`${getStatusColor('unknown')}? ${unknown_count} with unknown status${resetColor()}`)
        }
        if (error_count > 0) {
            console.log(`${getStatusColor('error')}✗ ${error_count} with errors${resetColor()}`)
        }
        
        console.log('='.repeat(60))
        
        // Exit with appropriate code based on overall status
        if (overall_has_error) {
            console.log(`${getStatusColor('error')}✗ Cluster analysis complete: Has errors${resetColor()}`)
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

// Run if called directly
if (require.main === module) {
    $$()
}