import * as _pi from 'pareto-core/dist/interface'

import * as d_utd from "../../modules/npm/interface/to_be_generated/update_package_dependencies"
import * as d_path from "pareto-resources/dist/interface/generated/liana/schemas/fs_unrestricted_path/data"
import * as d_stat from "pareto-resources/dist/interface/generated/liana/schemas/fs_unrestricted_stat_possible_node/data"

export type Parameters = {
    'path': d_path.Context_Path,
}

export type Error =
    | ['error updating lib', d_utd.Error]
    | ['error updating test', d_utd.Error]
    | ['error updating app', d_utd.Error]
    | ['error statting app dir', d_stat.Error]
