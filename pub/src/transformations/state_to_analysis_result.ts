import { Package_State, Pre_Publish_State, Pre_Commit_State, Structural_State } from "../interface/package_state"
import { Package_Analysis_Result } from "../interface/analysis_result"

export const structural_state_to_analysis_result = (structural_state: Structural_State): Package_Analysis_Result => {
    
    const children: Package_Analysis_Result[] = []
    
    // Check package name consistency
    children.push({
        'category': 'package name',
        'outcome': structural_state['package name the same as directory'] 
            ? 'matches directory' 
            : 'differs from directory',
        'status': structural_state['package name the same as directory'] 
            ? ['success', null] 
            : ['issue', null],
        'children': []
    })
    
    // Check structure validation
    if (structural_state.structure[0] === 'valid') {
        children.push({
            'category': 'structure',
            'outcome': structural_state.structure[1].warnings.length > 0 
                ? `valid with ${structural_state.structure[1].warnings.length} warnings`
                : 'valid',
            'status': structural_state.structure[1].warnings.length > 0 
                ? ['warning', null] 
                : ['success', null],
            'children': []
        })
    } else {
        const errorChildren: Package_Analysis_Result[] = structural_state.structure[1].errors.map(error => ({
            'category': 'structure error',
            'outcome': error,
            'status': ['issue', null] as Package_Analysis_Result['status'],
            'children': []
        }))
        
        children.push({
            'category': 'structure',
            'outcome': `invalid (${structural_state.structure[1].errors.length} issues)`,
            'status': ['issue', null],
            'children': errorChildren
        })
    }
    
    // Check interface implementation match
    const iim = structural_state['interface implementation match']
    let iim_outcome: string
    let iim_status: Package_Analysis_Result['status']
    let differenceChildren: Package_Analysis_Result[] = []
    
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
        differenceChildren = iim[1].differences.map(diff => ({
            'category': 'interface implementation difference',
            'outcome': `${diff.path}: ${diff.problem[0]}`,
            'status': ['issue', null] as Package_Analysis_Result['status'],
            'children': []
        }))
        
        iim_outcome = `mismatched (${iim[1].differences.length} differences)`
        iim_status = ['issue', null]
    }
    
    children.push({
        'category': 'interface implementation',
        'outcome': iim_outcome,
        'status': iim_status,
        'children': differenceChildren
    })
    
    // Determine overall status based on children
    const has_issue = children.some(child => child.status[0] === 'issue')
    const has_warning = children.some(child => child.status[0] === 'warning')
    
    let overall_status: Package_Analysis_Result['status']
    let overall_outcome: string
    
    if (has_issue) {
        overall_status = ['issue', null]
        overall_outcome = 'has structural issues'
    } else if (has_warning) {
        overall_status = ['warning', null]
        overall_outcome = 'has structural warnings'
    } else {
        overall_status = ['success', null]
        overall_outcome = 'structure valid'
    }
    
    return {
        'category': 'structural',
        'outcome': overall_outcome,
        'status': overall_status,
        'children': children
    }
}

export const pre_commit_state_to_analysis_result = (pre_commit_state: Pre_Commit_State): Package_Analysis_Result => {
    
    const children: Package_Analysis_Result[] = []
    
    // Check test results
    const test_result = pre_commit_state.test
    let test_outcome: string
    let test_status: Package_Analysis_Result['status']
    
    if (test_result[0] === 'success') {
        test_outcome = 'passed'
        test_status = ['success', null]
    } else {
        // failure
        if (test_result[1][0] === 'build') {
            test_outcome = 'build failed'
        } else {
            test_outcome = `tests failed (${test_result[1][1]['failed tests'].length} failures)`
        }
        test_status = ['issue', null]
    }
    
    children.push({
        'category': 'test',
        'outcome': test_outcome,
        'status': test_status,
        'children': []
    })
    
    // Add structural analysis as a child
    const structural_result = structural_state_to_analysis_result(pre_commit_state.structural)
    children.push(structural_result)
    
    // Determine overall status based on children
    const has_issue = children.some(child => child.status[0] === 'issue')
    const has_warning = children.some(child => child.status[0] === 'warning')
    
    let overall_status: Package_Analysis_Result['status']
    let overall_outcome: string
    
    if (has_issue) {
        overall_status = ['issue', null]
        overall_outcome = 'has pre-commit issues'
    } else if (has_warning) {
        overall_status = ['warning', null]
        overall_outcome = 'has pre-commit warnings'
    } else {
        overall_status = ['success', null]
        overall_outcome = 'pre-commit checks passed'
    }
    
    return {
        'category': 'pre-commit',
        'outcome': overall_outcome,
        'status': overall_status,
        'children': children
    }
}

export const pre_publish_state_to_analysis_result = (pre_publish_state: Pre_Publish_State): Package_Analysis_Result => {
    
    const children: Package_Analysis_Result[] = []
    
    // Check git status
    const git_status = pre_publish_state.git
    const has_git_issues = git_status['staged files'] || git_status['dirty working tree'] || git_status['unpushed commits']
    
    // Only add detailed git sub-results if there are git issues
    const git_children: Package_Analysis_Result[] = []
    if (has_git_issues) {
        git_children.push({
            'category': 'staged files',
            'outcome': git_status['staged files'] ? 'yes' : 'no',
            'status': git_status['staged files'] ? ['issue', null] : ['success', null],
            'children': []
        })
        
        git_children.push({
            'category': 'dirty working tree',
            'outcome': git_status['dirty working tree'] ? 'yes' : 'no',
            'status': git_status['dirty working tree'] ? ['issue', null] : ['success', null],
            'children': []
        })
        
        git_children.push({
            'category': 'unpushed commits',
            'outcome': git_status['unpushed commits'] ? 'yes' : 'no',
            'status': git_status['unpushed commits'] ? ['issue', null] : ['success', null],
            'children': []
        })
    }
    
    children.push({
        'category': 'git',
        'outcome': has_git_issues ? 'unpushed work' : 'clean',
        'status': has_git_issues ? ['issue', null] : ['success', null],
        'children': git_children
    })
    
    // Check dependencies
    const dependencies = pre_publish_state.dependencies
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
        const dep_issues = dependency_children.filter(child => child.status[0] === 'issue').length
        const dep_warnings = dependency_children.filter(child => child.status[0] === 'warning').length
        const dep_unknown = dependency_children.filter(child => child.status[0] === 'unknown').length
        
        let dep_outcome: string
        let dep_status: Package_Analysis_Result['status']
        
        if (dep_issues > 0) {
            dep_outcome = `${dep_issues} issues, ${dep_warnings} warnings`
            if (dep_unknown > 0) {
                dep_outcome += `, ${dep_unknown} unknown`
            }
            dep_status = ['issue', null]
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
    const published = pre_publish_state['published comparison']
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
    
    // Add pre-commit analysis as a child
    const pre_commit_result = pre_commit_state_to_analysis_result(pre_publish_state['pre-commit'])
    children.push(pre_commit_result)
    
    // Determine overall status based on children
    const has_issue = children.some(child => child.status[0] === 'issue')
    const has_warning = children.some(child => child.status[0] === 'warning')
    const has_unknown = children.some(child => child.status[0] === 'unknown')
    
    let overall_status: Package_Analysis_Result['status']
    let overall_outcome: string
    
    if (has_issue) {
        overall_status = ['issue', null]
        overall_outcome = 'has pre-publish issues'
    } else if (has_warning) {
        overall_status = ['warning', null]
        overall_outcome = 'has pre-publish warnings'
    } else if (has_unknown) {
        overall_status = ['unknown', null]
        overall_outcome = 'has unknown status'
    } else {
        overall_status = ['success', null]
        overall_outcome = 'pre-publish checks passed'
    }
    
    return {
        'category': 'pre-publish',
        'outcome': overall_outcome,
        'status': overall_status,
        'children': children
    }
}

export const package_state_to_analysis_result = (package_state: Package_State): Package_Analysis_Result => {
    
    const children: Package_Analysis_Result[] = []
    
    // Add pre-publish analysis as the main child
    const pre_publish_result = pre_publish_state_to_analysis_result(package_state['pre-publish'])
    children.push(pre_publish_result)
    
    // Determine overall status based on pre-publish result
    const overall_status = pre_publish_result.status
    const overall_outcome = pre_publish_result.outcome
    
    return {
        'category': 'package',
        'outcome': overall_outcome,
        'status': overall_status,
        'children': children
    }
}