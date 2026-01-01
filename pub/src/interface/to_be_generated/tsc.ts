import * as _pi from 'pareto-core-interface'

import * as d_espe from "pareto-resources/dist/interface/generated/pareto/schemas/execute_smelly_procedure_executable/data_types/source"
import * as d_path from "pareto-resources/dist/interface/generated/pareto/schemas/path/data_types/target"


export type Error =
    | ['error while running tsc', d_espe.Error]
// | ['could not commit', d_eqe.Error]
// | ['could not push', d_eqe.Error]


export type Parameters = {
    'path': _pi.Optional_Value<d_path.Node_Path>,
}
