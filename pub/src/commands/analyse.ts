#!/usr/bin/env node
/**
 * Package Analysis Command
 * 
 * Analyzes a single package repository and displays results with color-coded output.
 * 
 * Usage: pareto analyse <repository-root-directory>
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
import { determine_package_state } from '../old_lib/determine_package_state'
import { $$ as package_state_to_analysis_result } from '../transformations/package_state_to_analysis_result'
import type { Package_Analysis_Result } from '../interface/analysis_result'

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

function showHelp(): void {
    console.log(`
Package Analysis Tool

Usage: 
  pareto analyse [options] [package-root-directory]

Options:
  --help                              Show this help message
  --fast                              Fast analysis (skip build, test, and published comparison)
  --skip-build-and-test              Skip building and testing (faster analysis)
  --skip-compare-against-published   Skip comparison with published version

By default, the analysis includes:
  • Building and testing the package
  • Comparing against the published version

You can use --fast or individual skip flags to speed up the analysis, by skipping build, test, and published comparison.

Arguments:
  package-root-directory   Path to package root (defaults to current directory)
                          Expected structure: <path>/pub/package.json

Examples:
  pareto analyse                     # Analyze current directory (full analysis)
  pareto analyse /path/to/package    # Analyze specific package (full analysis)
  pareto analyse --fast              # Fast analysis (skips build, test, and comparison)
  pareto analyse --skip-build-and-test --skip-compare-against-published  # Same as --fast
`)
}

export const $$ = (): void => {
    // Parse command line arguments
    const args = process.argv.slice(2)
    
    // Check for help flag
    if (args.includes('--help') || args.includes('-h')) {
        showHelp()
        process.exit(0)
    }
    
    // Parse flags
    const fast_mode = args.includes('--fast')
    const skip_build_and_test = args.includes('--skip-build-and-test') || fast_mode
    const skip_compare_against_published = args.includes('--skip-compare-against-published') || fast_mode
    
    // Get package directory (non-flag arguments)
    const non_flag_args = args.filter(arg => !arg.startsWith('--'))
    const package_dir = non_flag_args.length > 0 ? path.resolve(non_flag_args[0]) : process.cwd()
    
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
        
        // Show information about default behavior and available speed-up options
        if (!skip_build_and_test || !skip_compare_against_published) {
            console.log('💡 Tip: You can use --fast to speed up the analysis')
        }
        
        console.log('='.repeat(50))
        
        // Determine package state
        const package_state = determine_package_state({
            'path to package': path.dirname(package_dir),
            'directory name': path.basename(package_dir),
            'build and test': !skip_build_and_test,  // Default to true, skip if flag set
            'compare to published': !skip_compare_against_published  // Default to true, skip if flag set
        })
        
        // Transform to analysis result
        const analysis_result = package_state_to_analysis_result(package_state)
        
        // Print colored analysis result
        printAnalysisResult(analysis_result)
        
        console.log('='.repeat(50))
        
        // Exit with appropriate code based on overall status
        switch (analysis_result.status[0]) {
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
            case 'error':
                console.log(`${getStatusColor('error')}✗ Analysis complete: Has errors${resetColor()}`)
                process.exit(1)
                break
        }
        
    } catch (error) {
        console.error(`Error analyzing package: ${error}`)
        process.exit(1)
    }
}

// Run if called directly
if (require.main === module) {
    $$()
}