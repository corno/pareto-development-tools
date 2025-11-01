import { Pre_Commit_State } from "../interface/package_state"
import { Package_Analysis_Result } from "../interface/analysis_result"
import { $$ as structural_state_to_analysis_result } from "./structural_state_to_analysis_result"

export const $$ = (pre_commit_state: Pre_Commit_State): Package_Analysis_Result => {
    
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