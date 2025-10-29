"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.$$ = void 0;
const { build_project, test_project } = require('./build_test_utils');
const $$ = (path, options) => {
    const verbose = options.verbose || false;
    const throw_on_error = options.throw_on_error || false;
    const test_file = options.test_file || './test/dist/bin/test.js';
    const skip_tests = options.skip_tests || false;
    const errors = [];
    try {
        // Build
        const build_success = build_project(path, { verbose, throw_on_error: false });
        if (!build_success) {
            errors.push('Build failed');
            if (throw_on_error) {
                throw new Error('Build failed');
            }
            return ['failure', {
                    reason: ['build failing', {
                            details: errors.join('\n')
                        }]
                }];
        }
        // Test (only if build succeeded and tests are not skipped)
        if (!skip_tests) {
            const test_success = test_project(path, { verbose, throw_on_error: false, test_file });
            if (!test_success) {
                errors.push('Tests failed');
                if (throw_on_error) {
                    throw new Error('Tests failed');
                }
                return ['failure', {
                        reason: ['tests failing', {
                                details: errors.join('\n')
                            }]
                    }];
            }
        }
        return ['success', null];
    }
    catch (err) {
        if (throw_on_error) {
            throw err;
        }
        return ['failure', {
                reason: ['build failing', {
                        details: err.message || 'Unknown error'
                    }]
            }];
    }
};
exports.$$ = $$;
