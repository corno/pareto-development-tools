"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.$$ = void 0;
const { validate_repository_structure } = require('./structure_validation_utils');
const buildAndTestModule = require('./build_and_test');
const build_and_test = buildAndTestModule.$$;
const $$ = (path, structure) => {
    const all_warnings = [];
    // 1. Validate structure
    const validation_result = validate_repository_structure(path, structure, false);
    if (validation_result.issues.length > 0) {
        const errors = validation_result.issues
            .filter((issue) => issue[0] === 'error')
            .map((issue) => issue[1][1]);
        const warnings = validation_result.issues
            .filter((issue) => issue[0] === 'warning')
            .map((issue) => issue[1][1]);
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
    }
    catch (err) {
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
};
exports.$$ = $$;
