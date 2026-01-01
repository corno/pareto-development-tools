import * as _pi from 'pareto-core-interface'

import * as d_epe from "pareto-resources/dist/interface/generated/pareto/schemas/execute_procedure_executable/data_types/source"
import * as d_path from "pareto-resources/dist/interface/generated/pareto/schemas/path/data_types/target"

export type Parameters = {
    'path': _pi.Optional_Value<d_path.Node_Path>,
}

export type Error =
    | ['unexpected error', d_epe.Error]
