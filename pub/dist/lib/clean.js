"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.$$ = void 0;
const { clean_project, git_clean_project } = require('./clean_utils');
const $$ = (path, options) => {
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
    }
    else {
        return ['failure', {
                errors: result.errors
            }];
    }
};
exports.$$ = $$;
