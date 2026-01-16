import * as _pi from 'pareto-core-interface'

import * as d_eqe from "pareto-resources/dist/interface/generated/pareto/schemas/execute_query_executable/data"
import * as d_iwt from "./is_inside_work_tree"
import * as d_path from "pareto-resources/dist/interface/generated/pareto/schemas/path/data"

export type Result = boolean

export type Error =
    | ['could not determine git status', d_eqe.Error]
    | ['not a git repository', null]
    | ['unknown issue', d_iwt.Error]

export type Parameters = {
    'path': _pi.Optional_Value<d_path.Context_Path>,
}