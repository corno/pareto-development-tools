import { Structural_State } from "../interface/package_state"
import { Package_Analysis_Result } from "../interface/analysis_result"

export const $$ = (structural_state: Structural_State): Package_Analysis_Result => {
    
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
        children.push({
            'category': 'structure',
            'outcome': `invalid (${structural_state.structure[1].errors.length} issues)`,
            'status': ['issue', null],
            'children': []
        })
    }
    
    // Check interface implementation match
    const iim = structural_state['interface implementation match']
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
        iim_status = ['issue', null]
    }
    
    children.push({
        'category': 'interface implementation',
        'outcome': iim_outcome,
        'status': iim_status,
        'children': []
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