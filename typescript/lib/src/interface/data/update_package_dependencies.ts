
import type * as d_utd from "../../modules/npm/interface/data/update_package_dependencies.js"
import type * as d_path from "pareto-resources/interface/data/fs_unrestricted_path"
import type * as d_stat from "pareto-filesystem-unrestricted-api/interface/data/fs_unrestricted_stat_possible_node"

export type Parameters = {
    'path': d_path.Context_Path,
}

export type Error =
    | ['error updating lib', d_utd.Error]
    | ['error updating test', d_utd.Error]
    | ['error updating app', d_utd.Error]
    | ['error statting app dir', d_stat.Error]
