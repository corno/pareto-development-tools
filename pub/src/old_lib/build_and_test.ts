const { build_project, test_project } = require('./build_test_utils');

export type Status =
    | ['success', null]
    | ['failure', {
        reason:
        | ['build failing', { details: string }]
        | ['tests failing', { details: string }]
    }]


export const $$ = (
    path: string,
    options: {
        'verbose'?: boolean,
        'skip_tests'?: boolean
    }
): Status => {
    const verbose = options.verbose || false;
    const skip_tests = options.skip_tests || false;

    const errors: string[] = [];

    // Build
    const build_success = build_project(path, { verbose });
    if (!build_success) {
        errors.push('Build failed');
        return ['failure', {
            reason: ['build failing', {
                details: errors.join('\n')
            }]
        }];
    }

    // Test (only if build succeeded and tests are not skipped)
    if (!skip_tests) {
        const test_success = test_project(path, { verbose });
        if (!test_success) {
            errors.push('Tests failed');
            return ['failure', {
                reason: ['tests failing', {
                    details: errors.join('\n')
                }]
            }];
        }
    }

    return ['success', null];

}