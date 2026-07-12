
import type * as s_tsc from "./tsc.js"
import type * as s_remove from "./fs_unrestricted_remove.js"
import type * as s_path from "./fs_unrestricted_path.js"
import type * as s_stat from "./fs_unrestricted_stat_possible_node.js"
import type * as s_chmod from "./fs_unrestricted_chmod.js"

export type Parameters = {
    'path': s_path.Context_Path,
}

export type Error =
    | ['error removing lib dist dir', {
        'path': s_path.Context_Path
        'error': s_remove.Error
    }]
    | ['error building lib', {
        'path': s_path.Context_Path
        'error': s_tsc.Error
    }]
    | ['error removing test dist dir', {
        'path': s_path.Context_Path
        'error': s_remove.Error
    }]
    | ['error building test', {
        'path': s_path.Context_Path
        'error': s_tsc.Error
    }]
    | ['error statting app dir', s_stat.Error]
    | ['error removing app dist dir', {
        'path': s_path.Context_Path
        'error': s_remove.Error
    }]
    | ['error building app', {
        'path': s_path.Context_Path
        'error': s_tsc.Error
    }]
    | ['error setting permissions on app dist bin.js', {
        'path': s_path.Context_Path
        'error': s_chmod.Error
    }]
