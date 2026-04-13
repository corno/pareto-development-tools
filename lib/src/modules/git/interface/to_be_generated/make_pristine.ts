import * as _pi from 'pareto-core/dist/interface'

import * as d_epe from "pareto-resources/dist/interface/generated/liana/schemas/execute_command_executable/data"
import * as d_path from "pareto-resources/dist/interface/generated/liana/schemas/path/data"

export type Parameters = {
    'path': _pi.Optional_Value<d_path.Context_Path>,
}

export type Error =
    | ['unexpected error', d_epe.Error]
