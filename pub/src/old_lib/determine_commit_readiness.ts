const { validate_repository_structure } = require('./structure_validation_utils');
const buildAndTestModule = require('./build_and_test');
const build_and_test = buildAndTestModule.$$;

export type Status =
    | ['ready', {
        warnings: string[]
    }]
    | ['not ready', {
        reason: 
        | ['structure not valid', { 
            errors: string[]
        }]
        | ['tests failing', { details: string }]
        | ['build failing', { details: string }]
    }]


export const $$ = (path: string, structure: any): Status => {
    const all_warnings: string[] = [];
    
    // 1. Validate structure
    const validation_result = validate_repository_structure(path, structure, false);
    
    if (validation_result.issues.length > 0) {
        const errors = validation_result.issues
            .filter((issue: any) => issue[0] === 'error')
            .map((issue: any) => issue[1][1]);
        
        const warnings = validation_result.issues
            .filter((issue: any) => issue[0] === 'warning')
            .map((issue: any) => issue[1][1]);
        
        all_warnings.push(...warnings);
        
        if (errors.length > 0) {
            return ['not ready', {
                reason: ['structure not valid', {
                    errors: errors
                }]
            }];
        }
    }
    
    // 2. Build and test
    try {
        const result = build_and_test(path, {
            verbose: false,
            throw_on_error: false
        });
        
        if (result[0] === 'failure') {
            const [reason_type, reason_details] = result[1].reason;
            return ['not ready', {
                reason: [reason_type, {
                    details: reason_details.details
                }]
            }];
        }
    } catch (err: any) {
        return ['not ready', {
            reason: ['build failing', {
                details: err.message || 'Unknown error'
            }]
        }];
    }
    
    // All checks passed
    return ['ready', {
        warnings: all_warnings
    }];
}