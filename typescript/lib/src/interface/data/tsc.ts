import * as p_di from 'pareto-core/dist/interface/data'

import * as d_espe from "pareto-resources/dist/interface/generated/liana/schemas/execute_sandboxed_smelly_command_executable/data"
import * as d_path from "pareto-resources/dist/interface/generated/liana/schemas/fs_unrestricted_path/data"


export type Error =
    | ['error while running tsc', d_espe.Error]
// | ['could not commit', d_eqe.Error]
// | ['could not push', d_eqe.Error]


export type Parameters = {
    'path': p_di.Optional_Value<d_path.Context_Path>,
}
