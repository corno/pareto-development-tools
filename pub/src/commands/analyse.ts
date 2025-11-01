/**
 * Package Analysis Command
 * 
 * Analyzes a single package repository and displays results with color-coded output.
 * 
 * Usage: pareto analyse [options] [package-root-directory]
 * 
 * The directory should be the repository root containing a pub/ subdirectory.
 * Expected structure:
 *   <repository-root>/
 *   ├── pub/
 *   │   ├── package.json
 *   │   └── src/
 *   └── test/ (optional)
 * 
 * Example: pareto analyse /path/to/my-package-repo
 * This will analyze /path/to/my-package-repo/pub/package.json
 */

import * as fs from 'fs'
import * as path from 'path'
import { determine_package_state } from '../queries/analyse_package'
import { determine_pre_publish_state } from '../queries/analyse_package_pre_publish'
import { determine_pre_commit_state } from '../queries/analyse_package_pre_commit'
import { determine_structural_state } from '../queries/analyse_package_structural'
import { 
    package_state_to_analysis_result,
    pre_publish_state_to_analysis_result,
    pre_commit_state_to_analysis_result,
    structural_state_to_analysis_result
} from '../transformations/state_to_analysis_result'
import type { Package_Analysis_Result } from '../interface/analysis_result'

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

function showHelp(): void {
    console.log(`
Package Analysis Tool

Usage: 
  pareto analyse [options] <package-root-directory>

Options:
  --help                Show this help message
  --pre-publish         Pre-publish analysis (includes build, test, structure, and published comparison)
  --pre-commit          Pre-commit analysis (includes build, test, and structure validation)
  --structural          Structural analysis only (fastest - only structure validation)

Analysis levels (from most comprehensive to fastest):
  • (no flag): Complete package state analysis (default)
  • --pre-publish: Pre-publish checks (git state, dependencies, testing, structure, published comparison)
  • --pre-commit: Pre-commit checks (testing and structure validation)
  • --structural: Structure validation only

Arguments:
  package-root-directory   Path to package root (required)
                          Expected structure: <path>/pub/package.json

Examples:
  pareto analyse /path/to/package                 # Full analysis (default)
  pareto analyse /path/to/package --structural    # Fast structural check only
  pareto analyse /path/to/package --pre-commit    # Pre-commit validation
  pareto analyse /path/to/package --pre-publish   # Pre-publish validation
`)
}

export const $$ = (args: string[]): void => {
    // Check for help flag
    if (args.includes('--help') || args.includes('-h')) {
        showHelp()
        process.exit(0)
    }
    
    // Parse analysis level flags - no --all flag, default is full analysis
    const pre_publish_analysis = args.includes('--pre-publish')
    const pre_commit_analysis = args.includes('--pre-commit')
    const structural_analysis = args.includes('--structural')
    
    // Validate that only one analysis level is specified
    const analysis_flags = [pre_publish_analysis, pre_commit_analysis, structural_analysis].filter(Boolean)
    if (analysis_flags.length > 1) {
        console.error('Error: Please specify only one analysis level (--pre-publish, --pre-commit, or --structural)')
        process.exit(1)
    }
    
    // If no analysis flags specified, inform user about available options
    if (analysis_flags.length === 0) {
        console.log('Running full package analysis (all checks)...')
        console.log('Available analysis levels:')
        console.log('  --structural   : Structure validation only (fastest)')
        console.log('  --pre-commit   : Build, test, and structure validation')
        console.log('  --pre-publish  : All pre-commit checks plus git state, dependencies, and published comparison')
        console.log('  (no flag)      : Complete package analysis (default)')
        console.log('')
    }
    
    // Get package directory (non-flag arguments) - path is required
    const non_flag_args = args.filter(arg => !arg.startsWith('--'))
    if (non_flag_args.length === 0) {
        console.error('Error: Package directory path is required')
        console.error('Usage: pareto analyse [options] <package-root-directory>')
        console.error('Expected structure: <your-path>/pub/package.json')
        process.exit(1)
    }
    
    const package_dir = path.resolve(non_flag_args[0])
    
    // Check if this is a valid package structure (has pub/package.json)
    const package_json_path = path.join(package_dir, 'pub', 'package.json')
    if (!fs.existsSync(package_json_path)) {
        console.error(`Error: No pub/package.json found in directory: ${package_dir}`)
        console.error('Please specify the package root directory (parent of pub/), not the pub/ directory itself.')
        console.error('Expected structure: <your-path>/pub/package.json')
        process.exit(1)
    }
    
    try {
        console.log(`Analyzing package: ${path.basename(package_dir)}`)
        console.log('='.repeat(50))
        
        // Get package name for the analysis functions
        function getPackageName(package_dir: string): string {
            const package_json_path = path.join(package_dir, 'pub', 'package.json')
            try {
                const package_content = JSON.parse(fs.readFileSync(package_json_path, 'utf8'))
                return package_content.name || path.basename(package_dir)
            } catch {
                return path.basename(package_dir)
            }
        }
        
        const package_name = getPackageName(package_dir)
        
        const analysis_params = {
            'path to package': path.dirname(package_dir),
            'directory name': path.basename(package_dir),
            'package name': package_name
        }
        
        let analysis_result: Package_Analysis_Result
        
        if (structural_analysis) {
            console.log('Running structural analysis...')
            const structural_state = determine_structural_state(analysis_params)
            analysis_result = structural_state_to_analysis_result(structural_state)
        } else if (pre_commit_analysis) {
            console.log('Running pre-commit analysis...')
            const pre_commit_state = determine_pre_commit_state(analysis_params)
            analysis_result = pre_commit_state_to_analysis_result(pre_commit_state)
        } else if (pre_publish_analysis) {
            console.log('Running pre-publish analysis...')
            const pre_publish_state = determine_pre_publish_state(analysis_params)
            analysis_result = pre_publish_state_to_analysis_result(pre_publish_state)
        } else {
            // Full analysis (default when no flags specified)
            console.log('Running full package analysis...')
            const package_state = determine_package_state(analysis_params)
            analysis_result = package_state_to_analysis_result(package_state)
        }
        
        // Print colored analysis result
        printAnalysisResult(analysis_result, 0, 'package')
        
        console.log('='.repeat(50))
        
        // Exit with appropriate code based on overall status
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
        
        const overall_status = getOverallStatus(analysis_result)
        
        switch (overall_status) {
            case 'success':
                console.log(`${getStatusColor('success')}✓ Analysis complete: All checks passed${resetColor()}`)
                process.exit(0)
                break
            case 'warning':
                console.log(`${getStatusColor('warning')}⚠ Analysis complete: Has warnings${resetColor()}`)
                process.exit(0)
                break
            case 'unknown':
                console.log(`${getStatusColor('unknown')}? Analysis complete: Unknown status (some checks skipped)${resetColor()}`)
                process.exit(0)
                break
            case 'issue':
                console.log(`${getStatusColor('issue')}✗ Analysis complete: Has issues${resetColor()}`)
                process.exit(1)
                break
        }
        
    } catch (error) {
        console.error(`Error analyzing package: ${error}`)
        process.exit(1)
    }
}