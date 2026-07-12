
import type * as s_utd from "../../submodules/npm/interface/schemas/update_package_dependencies.js"
import type * as s_path from "./fs_unrestricted_path.js"
import type * as s_stat from "./fs_unrestricted_stat_possible_node.js"

export type Parameters = {
    'path': s_path.Context_Path,
}

export type Error =
    | ['error updating lib', s_utd.Error]
    | ['error updating test', s_utd.Error]
    | ['error updating app', s_utd.Error]
    | ['error statting app dir', s_stat.Error]
