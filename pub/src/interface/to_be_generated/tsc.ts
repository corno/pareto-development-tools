import * as _pi from 'pareto-core/dist/interface'

import * as d_espe from "pareto-resources/dist/interface/generated/liana/schemas/execute_smelly_command_executable/data"
import * as d_path from "pareto-resources/dist/interface/generated/liana/schemas/path/data"


export type Error =
    | ['error while running tsc', d_espe.Error]
// | ['could not commit', d_eqe.Error]
// | ['could not push', d_eqe.Error]


export type Parameters = {
    'path': _pi.Optional_Value<d_path.Node_Path>,
}
