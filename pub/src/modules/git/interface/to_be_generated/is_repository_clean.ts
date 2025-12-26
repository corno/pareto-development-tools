import * as _et from 'exupery-core-types'
import * as _easync from 'exupery-core-async'

import * as d_eqe from "exupery-resources/dist/interface/generated/pareto/schemas/execute_query_executable/data_types/source"
import * as d_iwt from "./is_inside_work_tree"
import * as d_path from "exupery-resources/dist/interface/generated/pareto/schemas/path/data_types/target"

export type Result = boolean

export type Error =
    | ['could not determine git status', d_eqe.Error]
    | ['not a git repository', null]
    | ['unknown issue', d_iwt.Error]

export type Parameters = {
    'path': _et.Optional_Value<d_path.Context_Path>,
}