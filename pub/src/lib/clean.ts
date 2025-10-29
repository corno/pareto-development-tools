import { clean_project } from './clean_project';

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
    
    try {
        clean_project(path, {
            verbose,
            dist_only,
            node_modules_only,
            use_git
        });
        
        // Since clean_project throws on error, if we get here it was successful
        const cleaned_items: string[] = [];
        if (!node_modules_only) cleaned_items.push('dist');
        if (!dist_only) cleaned_items.push('node_modules');
        if (use_git) cleaned_items.push('git-ignored-files');
        
        return ['success', {
            cleaned: cleaned_items
        }];
    } catch (err: any) {
        return ['failure', {
            errors: [err.message]
        }];
    }
}