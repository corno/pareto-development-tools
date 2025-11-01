import { Package_State } from "../interface/package_state"
import { Package_Analysis_Result } from "../interface/analysis_result"
import { $$ as pre_publish_state_to_analysis_result } from "./pre_publish_state_to_analysis_result"

export const $$ = (package_state: Package_State): Package_Analysis_Result => {
    
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