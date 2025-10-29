"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.$$ = void 0;
const clean_project_1 = require("./clean_project");
const $$ = (path, options) => {
    const verbose = options.verbose || false;
    const dist_only = options.dist_only || false;
    const node_modules_only = options.node_modules_only || false;
    const use_git = options.use_git || false;
    try {
        (0, clean_project_1.clean_project)(path, {
            verbose,
            dist_only,
            node_modules_only,
            use_git
        });
        // Since clean_project throws on error, if we get here it was successful
        const cleaned_items = [];
        if (!node_modules_only)
            cleaned_items.push('dist');
        if (!dist_only)
            cleaned_items.push('node_modules');
        if (use_git)
            cleaned_items.push('git-ignored-files');
        return ['success', {
                cleaned: cleaned_items
            }];
    }
    catch (err) {
        return ['failure', {
                errors: [err.message]
            }];
    }
};
exports.$$ = $$;
