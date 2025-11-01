import { Package_State } from "../interface/package_state"
import { Package_Analysis_Result } from "../interface/analysis_result"

export const $$ = (package_state: Package_State): Package_Analysis_Result => {
    
    const children: Package_Analysis_Result[] = []
    
    // Check package name consistency
    children.push({
        'category': 'package name',
        'outcome': package_state['package name the same as directory'] 
            ? 'matches directory' 
            : 'differs from directory',
        'status': package_state['package name the same as directory'] 
            ? ['success', null] 
            : ['error', null],
        'children': []
    })
    
    // Check git status
    const git_status = package_state.git
    const has_git_issues = git_status['staged files'] || git_status['dirty working tree'] || git_status['unpushed commits']
    
    // Only add detailed git sub-results if there are git issues
    const git_children: Package_Analysis_Result[] = []
    if (has_git_issues) {
        git_children.push({
            'category': 'staged files',
            'outcome': git_status['staged files'] ? 'yes' : 'no',
            'status': git_status['staged files'] ? ['error', null] : ['success', null],
            'children': []
        })
        
        git_children.push({
            'category': 'dirty working tree',
            'outcome': git_status['dirty working tree'] ? 'yes' : 'no',
            'status': git_status['dirty working tree'] ? ['error', null] : ['success', null],
            'children': []
        })
        
        git_children.push({
            'category': 'unpushed commits',
            'outcome': git_status['unpushed commits'] ? 'yes' : 'no',
            'status': git_status['unpushed commits'] ? ['error', null] : ['success', null],
            'children': []
        })
    }
    
    children.push({
        'category': 'git',
        'outcome': has_git_issues ? 'unpushed work' : 'clean',
        'status': has_git_issues ? ['error', null] : ['success', null],
        'children': git_children
    })
    
    // Check structure validation
    if (package_state.structure[0] === 'valid') {
        children.push({
            'category': 'structure',
            'outcome': package_state.structure[1].warnings.length > 0 
                ? `valid with ${package_state.structure[1].warnings.length} warnings`
                : 'valid',
            'status': package_state.structure[1].warnings.length > 0 
                ? ['warning', null] 
                : ['success', null],
            'children': []
        })
    } else {
        children.push({
            'category': 'structure',
            'outcome': `invalid (${package_state.structure[1].errors.length} errors)`,
            'status': ['error', null],
            'children': []
        })
    }
    
    // Check interface implementation match
    const iim = package_state['interface implementation match']
    let iim_outcome: string
    let iim_status: Package_Analysis_Result['status']
    
    if (iim[0] === 'matched') {
        iim_outcome = 'matched'
        iim_status = ['success', null]
    } else if (iim[0] === 'root interface direcory missing') {
        iim_outcome = 'interface directory missing'
        iim_status = ['warning', null]
    } else if (iim[0] === 'root implementation direcory missing') {
        iim_outcome = 'implementation directory missing'
        iim_status = ['warning', null]
    } else {
        // mismatched
        iim_outcome = `mismatched (${iim[1].differences.length} differences)`
        iim_status = ['error', null]
    }
    
    children.push({
        'category': 'interface implementation',
        'outcome': iim_outcome,
        'status': iim_status,
        'children': []
    })
    
    // Check test results
    const test_result = package_state.test
    let test_outcome: string
    let test_status: Package_Analysis_Result['status']
    
    if (test_result[0] === 'success') {
        test_outcome = 'passed'
        test_status = ['success', null]
    } else if (test_result[0] === 'skipped') {
        test_outcome = 'skipped'
        test_status = ['unknown', null]
    } else {
        // failure
        if (test_result[1][0] === 'build') {
            test_outcome = 'build failed'
        } else {
            test_outcome = `tests failed (${test_result[1][1]['failed tests'].length} failures)`
        }
        test_status = ['error', null]
    }
    
    children.push({
        'category': 'test',
        'outcome': test_outcome,
        'status': test_status,
        'children': []
    })
    
    // Check dependencies
    const dependencies = package_state.dependencies
    const dependency_children: Package_Analysis_Result[] = []
    
    for (const [dep_name, dep_info] of Object.entries(dependencies)) {
        if (dep_info.target[0] === 'found') {
            dependency_children.push({
                'category': `dependency ${dep_name}`,
                'outcome': dep_info.target[1]['dependency up to date'] 
                    ? 'up to date' 
                    : 'outdated',
                'status': dep_info.target[1]['dependency up to date'] 
                    ? ['success', null] 
                    : ['warning', null],
                'children': []
            })
        } else {
            dependency_children.push({
                'category': `dependency ${dep_name}`,
                'outcome': 'not found locally',
                'status': ['unknown', null],
                'children': []
            })
        }
    }
    
    if (dependency_children.length > 0) {
        const dep_errors = dependency_children.filter(child => child.status[0] === 'error').length
        const dep_warnings = dependency_children.filter(child => child.status[0] === 'warning').length
        const dep_unknown = dependency_children.filter(child => child.status[0] === 'unknown').length
        
        let dep_outcome: string
        let dep_status: Package_Analysis_Result['status']
        
        if (dep_errors > 0) {
            dep_outcome = `${dep_errors} errors, ${dep_warnings} warnings`
            if (dep_unknown > 0) {
                dep_outcome += `, ${dep_unknown} unknown`
            }
            dep_status = ['error', null]
        } else if (dep_warnings > 0) {
            dep_outcome = `${dep_warnings} warnings`
            if (dep_unknown > 0) {
                dep_outcome += `, ${dep_unknown} unknown`
            }
            dep_status = ['warning', null]
        } else if (dep_unknown > 0) {
            dep_outcome = `${dep_unknown} unknown`
            dep_status = ['unknown', null]
        } else {
            dep_outcome = 'all up to date'
            dep_status = ['success', null]
        }
        
        children.push({
            'category': 'dependencies',
            'outcome': dep_outcome,
            'status': dep_status,
            'children': dependency_children
        })
    }
    
    // Check published comparison
    const published = package_state['published comparison']
    let pub_outcome: string
    let pub_status: Package_Analysis_Result['status']
    
    if (published[0] === 'could compare') {
        if (published[1][0] === 'identical') {
            pub_outcome = 'identical to published'
            pub_status = ['success', null]
        } else {
            pub_outcome = 'differs from published'
            pub_status = ['warning', null]
        }
    } else if (published[0] === 'skipped') {
        pub_outcome = 'comparison skipped'
        pub_status = ['unknown', null]
    } else {
        // could not compare
        if (published[1][0] === 'no package') {
            pub_outcome = 'no package.json'
        } else if (published[1][0] === 'no package name') {
            pub_outcome = 'no package name'
        } else {
            pub_outcome = 'not published'
        }
        pub_status = ['warning', null]
    }
    
    children.push({
        'category': 'published comparison',
        'outcome': pub_outcome,
        'status': pub_status,
        'children': []
    })
    
    // Determine overall status based on children
    const has_error = children.some(child => child.status[0] === 'error')
    const has_warning = children.some(child => child.status[0] === 'warning')
    const has_unknown = children.some(child => child.status[0] === 'unknown')
    
    let overall_status: Package_Analysis_Result['status']
    let overall_outcome: string
    
    if (has_error) {
        overall_status = ['error', null]
        overall_outcome = 'has errors'
    } else if (has_warning) {
        overall_status = ['warning', null]
        overall_outcome = 'has warnings'
    } else if (has_unknown) {
        overall_status = ['unknown', null]
        overall_outcome = 'has unknown status'
    } else {
        overall_status = ['success', null]
        overall_outcome = 'all checks passed'
    }
    
    return {
        'category': 'package',
        'outcome': overall_outcome,
        'status': overall_status,
        'children': children
    }
}