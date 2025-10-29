const { clean_project, git_clean_project } = require('./clean_utils');

export type Status =
    | ['success', {
        cleaned: string[]
    }]
    | ['failure', {
        errors: string[]
    }]


export const $$ = (path: string, options: {
    'verbose'?: boolean,
    'dist_only'?: boolean,
    'node_modules_only'?: boolean,
    'use_git'?: boolean
}): Status => {
    const verbose = options.verbose || false;
    const dist_only = options.dist_only || false;
    const node_modules_only = options.node_modules_only || false;
    const use_git = options.use_git || false;
    
    const result = clean_project(path, {
        verbose,
        dist_only,
        node_modules_only,
        use_git
    });
    
    if (result.success) {
        return ['success', {
            cleaned: result.cleaned
        }];
    } else {
        return ['failure', {
            errors: result.errors
        }];
    }
}