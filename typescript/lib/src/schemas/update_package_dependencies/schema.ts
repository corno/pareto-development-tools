
import type * as s_utd from "../../modules/npm/schemas/update_package_dependencies/schema.js"
import type * as s_path from "pareto-filesystem-unrestricted-api/modules/unrestricted/schemas/path/schema"
import type * as s_stat from "pareto-filesystem-unrestricted-api/modules/unrestricted/schemas/stat_possible_node/schema"

export type Parameters = {
    'path': s_path.Context_Path,
}

export type Error =
    | ['error updating lib', s_utd.Error]
    | ['error updating test', s_utd.Error]
    | ['error updating app', s_utd.Error]
    | ['error statting app dir', s_stat.Error]
