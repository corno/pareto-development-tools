
import type * as d_tsc from "./tsc.js"
import type * as d_remove from "pareto-filesystem-unrestricted-api/interface/generated/liana/schemas/fs_unrestricted_remove/data"
import type * as d_path from "pareto-resources/interface/generated/liana/schemas/fs_unrestricted_path/data"
import type * as d_stat from "pareto-filesystem-unrestricted-api/interface/generated/liana/schemas/fs_unrestricted_stat_possible_node/data"
import type * as d_chmod from "pareto-filesystem-unrestricted-api/interface/generated/liana/schemas/fs_unrestricted_chmod/data"

export type Parameters = {
    'path': d_path.Context_Path,
}

export type Error =
    | ['error removing lib dist dir', {
        'path': d_path.Context_Path
        'error': d_remove.Error
    }]
    | ['error building lib', {
        'path': d_path.Context_Path
        'error': d_tsc.Error
    }]
    | ['error removing test dist dir', {
        'path': d_path.Context_Path
        'error': d_remove.Error
    }]
    | ['error building test', {
        'path': d_path.Context_Path
        'error': d_tsc.Error
    }]
    | ['error statting app dir', d_stat.Error]
    | ['error removing app dist dir', {
        'path': d_path.Context_Path
        'error': d_remove.Error
    }]
    | ['error building app', {
        'path': d_path.Context_Path
        'error': d_tsc.Error
    }]
    | ['error setting permissions on app dist bin.js', {
        'path': d_path.Context_Path
        'error': d_chmod.Error
    }]
