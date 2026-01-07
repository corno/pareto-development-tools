import * as _pi from 'pareto-core-interface'

import * as d_epe from "pareto-resources/dist/interface/generated/pareto/schemas/execute_procedure_executable/data_types/source"
import * as d_path from "pareto-resources/dist/interface/generated/pareto/schemas/path/data_types/target"

export type Parameters = {
    'path': _pi.Optional_Value<d_path.Context_Path>,
    'operation':
    | ['update', null]
    | ['install', null]
}

export type Error =
    | ['error while running npm', d_epe.Error]
// | ['could not commit', d_eqe.Error]
// | ['could not push', d_eqe.Error]
