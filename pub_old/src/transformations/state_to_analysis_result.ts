import { Package_Pre_Publish_State, Pre_Publish_State, Pre_Commit_State, Structural_State } from "../interface/package_state"
import { Package_Analysis_Result } from "../interface/temp/analysis_result"

export const structural_state_to_analysis_result = (structural_state: Structural_State): Package_Analysis_Result => {
    
    const children: { [key: string]: Package_Analysis_Result } = {}
    
    // Check package name consistency
    children['package name'] = ['leaf', {
        'outcome': structural_state['package name the same as directory'] 
            ? 'matches directory' 
            : 'differs from directory',
        'status': structural_state['package name the same as directory'] 
            ? ['success', null] 
            : ['issue', null]
    }]
    
    // Check structure validation
    if (structural_state.structure[0] === 'valid') {
        children['structure'] = ['leaf', {
            'outcome': structural_state.structure[1].warnings.length > 0 
                ? `valid with ${structural_state.structure[1].warnings.length} warnings`
                : 'valid',
            'status': structural_state.structure[1].warnings.length > 0 
                ? ['warning', null] 
                : ['success', null]
        }]
    } else {
        const errorChildren: { [key: string]: Package_Analysis_Result } = {}
        structural_state.structure[1].errors.forEach((error, index) => {
            errorChildren[`error ${index + 1}`] = ['leaf', {
                'outcome': error,
                'status': ['issue', null] as const
            }]
        })
        
        children['structure'] = ['composite', errorChildren]
    }
    
    // Check interface implementation match
    const iim = structural_state['interface implementation match']
    
    if (iim[0] === 'matched') {
        children['interface implementation'] = ['leaf', {
            'outcome': 'matched',
            'status': ['success', null]
        }]
    } else if (iim[0] === 'root interface direcory missing') {
        children['interface implementation'] = ['leaf', {
            'outcome': 'interface directory missing',
            'status': ['warning', null]
        }]
    } else if (iim[0] === 'root implementation direcory missing') {
        children['interface implementation'] = ['leaf', {
            'outcome': 'implementation directory missing',
            'status': ['warning', null]
        }]
    } else {
        // mismatched
        const differenceChildren: { [key: string]: Package_Analysis_Result } = {}
        iim[1].differences.forEach((diff, index) => {
            differenceChildren[`difference ${index + 1}`] = ['leaf', {
                'outcome': `${diff.path}: ${diff.problem[0]}`,
                'status': ['issue', null] as const
            }]
        })
        
        children['interface implementation'] = ['composite', differenceChildren]
    }
    
    // Determine overall status based on children
    const getStatus = (result: Package_Analysis_Result): ['success' | 'issue' | 'warning' | 'unknown', null] => {
        if (result[0] === 'leaf') {
            return result[1].status
        } else {
            // composite - get worst status from children
            const statuses = Object.values(result[1]).map(getStatus)
            if (statuses.some(s => s[0] === 'issue')) return ['issue', null]
            if (statuses.some(s => s[0] === 'warning')) return ['warning', null]
            if (statuses.some(s => s[0] === 'unknown')) return ['unknown', null]
            return ['success', null]
        }
    }
    
    const has_issue = Object.values(children).some(child => getStatus(child)[0] === 'issue')
    const has_warning = Object.values(children).some(child => getStatus(child)[0] === 'warning')
    
    let overall_status: ['success' | 'issue' | 'warning' | 'unknown', null]
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
    
    return ['composite', children]
}

export const pre_commit_state_to_analysis_result = (pre_commit_state: Pre_Commit_State): Package_Analysis_Result => {
    
    const children: { [key: string]: Package_Analysis_Result } = {}
    
    // Check test results
    const test_result = pre_commit_state.test
    let test_outcome: string
    let test_status: ['success' | 'issue' | 'warning' | 'unknown', null]
    
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
    
    children['test'] = ['leaf', {
        'outcome': test_outcome,
        'status': test_status
    }]
    
    // Add structural analysis as a child
    const structural_result = structural_state_to_analysis_result(pre_commit_state.structural)
    children['structural'] = structural_result
    
    // Determine overall status based on children
    const getStatus = (result: Package_Analysis_Result): ['success' | 'issue' | 'warning' | 'unknown', null] => {
        if (result[0] === 'leaf') {
            return result[1].status
        } else {
            // composite - get worst status from children
            const statuses = Object.values(result[1]).map(getStatus)
            if (statuses.some(s => s[0] === 'issue')) return ['issue', null]
            if (statuses.some(s => s[0] === 'warning')) return ['warning', null]
            if (statuses.some(s => s[0] === 'unknown')) return ['unknown', null]
            return ['success', null]
        }
    }
    
    const has_issue = Object.values(children).some(child => getStatus(child)[0] === 'issue')
    const has_warning = Object.values(children).some(child => getStatus(child)[0] === 'warning')
    
    let overall_status: ['success' | 'issue' | 'warning' | 'unknown', null]
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
    
    return ['composite', children]
}

export const pre_publish_state_to_analysis_result = (pre_publish_state: Pre_Publish_State): Package_Analysis_Result => {
    
    const children: { [key: string]: Package_Analysis_Result } = {}
    
    // Check git status
    const git_status = pre_publish_state.git
    const has_git_issues = git_status['staged files'] || git_status['dirty working tree'] || git_status['unpushed commits']
    
    // Only add detailed git sub-results if there are git issues
    if (has_git_issues) {
        const git_children: { [key: string]: Package_Analysis_Result } = {}
        
        // Add in desired order: dirty working tree, staged files, unpushed commits
        git_children['dirty working tree'] = ['leaf', {
            'outcome': git_status['dirty working tree'] ? 'yes' : 'no',
            'status': git_status['dirty working tree'] ? ['issue', null] : ['success', null]
        }]
        
        git_children['staged files'] = ['leaf', {
            'outcome': git_status['staged files'] ? 'yes' : 'no',
            'status': git_status['staged files'] ? ['issue', null] : ['success', null]
        }]
        
        git_children['unpushed commits'] = ['leaf', {
            'outcome': git_status['unpushed commits'] ? 'yes' : 'no',
            'status': git_status['unpushed commits'] ? ['issue', null] : ['success', null]
        }]
        
        children['git'] = ['composite', git_children]
    } else {
        children['git'] = ['leaf', {
            'outcome': 'clean',
            'status': ['success', null]
        }]
    }
    
    // Check dependencies
    const dependencies = pre_publish_state.dependencies
    const dependency_children: { [key: string]: Package_Analysis_Result } = {}
    
    for (const [dep_name, dep_info] of Object.entries(dependencies)) {
        if (dep_info.target[0] === 'found') {
            dependency_children[dep_name] = ['leaf', {
                'outcome': dep_info.target[1]['dependency up to date'] 
                    ? 'up to date' 
                    : 'outdated',
                'status': dep_info.target[1]['dependency up to date'] 
                    ? ['success', null] 
                    : ['warning', null]
            }]
        } else {
            dependency_children[dep_name] = ['leaf', {
                'outcome': 'not found locally',
                'status': ['unknown', null]
            }]
        }
    }
    
    if (Object.keys(dependency_children).length > 0) {
        const getStatus = (result: Package_Analysis_Result): ['success' | 'issue' | 'warning' | 'unknown', null] => {
            if (result[0] === 'leaf') {
                return result[1].status
            } else {
                // composite - get worst status from children
                const statuses = Object.values(result[1]).map(getStatus)
                if (statuses.some(s => s[0] === 'issue')) return ['issue', null]
                if (statuses.some(s => s[0] === 'warning')) return ['warning', null]
                if (statuses.some(s => s[0] === 'unknown')) return ['unknown', null]
                return ['success', null]
            }
        }
        
        const dep_issues = Object.values(dependency_children).filter(child => getStatus(child)[0] === 'issue').length
        const dep_warnings = Object.values(dependency_children).filter(child => getStatus(child)[0] === 'warning').length
        const dep_unknown = Object.values(dependency_children).filter(child => getStatus(child)[0] === 'unknown').length
        
        let dep_outcome: string
        let dep_status: ['success' | 'issue' | 'warning' | 'unknown', null]
        
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
        
        children['dependencies'] = ['composite', dependency_children]
    }
    
    // Check published comparison
    const published = pre_publish_state['published comparison']
    let pub_outcome: string
    let pub_status: ['success' | 'issue' | 'warning' | 'unknown', null]
    
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
    
    children['published comparison'] = ['leaf', {
        'outcome': pub_outcome,
        'status': pub_status
    }]
    
    // Add pre-commit analysis as a child
    const pre_commit_result = pre_commit_state_to_analysis_result(pre_publish_state['pre-commit'])
    children['pre-commit'] = pre_commit_result
    
    // Determine overall status based on children
    const getStatus = (result: Package_Analysis_Result): ['success' | 'issue' | 'warning' | 'unknown', null] => {
        if (result[0] === 'leaf') {
            return result[1].status
        } else {
            // composite - get worst status from children
            const statuses = Object.values(result[1]).map(getStatus)
            if (statuses.some(s => s[0] === 'issue')) return ['issue', null]
            if (statuses.some(s => s[0] === 'warning')) return ['warning', null]
            if (statuses.some(s => s[0] === 'unknown')) return ['unknown', null]
            return ['success', null]
        }
    }
    
    const has_issue = Object.values(children).some(child => getStatus(child)[0] === 'issue')
    const has_warning = Object.values(children).some(child => getStatus(child)[0] === 'warning')
    const has_unknown = Object.values(children).some(child => getStatus(child)[0] === 'unknown')
    
    let overall_status: ['success' | 'issue' | 'warning' | 'unknown', null]
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
    
    return ['composite', children]
}

export const package_state_to_analysis_result = (package_state: Package_Pre_Publish_State): Package_Analysis_Result => {
    
    // Add pre-publish analysis as the main child
    const pre_publish_result = pre_publish_state_to_analysis_result(package_state['level'])
    
    // Package level is just a container - no summary needed since it's the root
    return pre_publish_result
}