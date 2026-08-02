
import type * as s_tsc from "../tsc/schema.js"
import type * as s_remove from "pareto-filesystem-unrestricted-api/modules/unrestricted/schemas/remove/schema"
import type * as s_path from "pareto-filesystem-unrestricted-api/modules/unrestricted/schemas/path/schema"
import type * as s_stat from "pareto-filesystem-unrestricted-api/modules/unrestricted/schemas/stat_possible_node/schema"
import type * as s_chmod from "pareto-filesystem-unrestricted-api/modules/unrestricted/schemas/chmod/schema"

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
