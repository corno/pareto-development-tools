import * as p_ from 'pareto-core/interface/data'

import type * as d_espe from "pareto-resources/interface/data/execute_sandboxed_smelly_command_executable"
import type * as d_path from "pareto-resources/interface/data/fs_unrestricted_path"


export type Error =
    | ['error while running tsc', d_espe.Error]
// | ['could not commit', d_eqe.Error]
// | ['could not push', d_eqe.Error]


export type Parameters = {
    'path': p_.Optional_Value<d_path.Context_Path>,
}
