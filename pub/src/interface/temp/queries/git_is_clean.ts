import * as _et from 'exupery-core-types'
import * as _easync from 'exupery-core-async'

import * as d_eqe from "exupery-resources/dist/interface/generated/pareto/schemas/execute_query_executable/data_types/source"
import * as d_iwt from "./git_is_inside_work_tree"

export type Parameters = {
    'path': _et.Optional_Value<string>,
}

export type Result = boolean

export type Error =
    | ['could not determine git status', d_eqe.Error]
    | ['not a git repository', null]
    | ['unknown issue', d_iwt.Error]

export type Resources = {
    'is inside git work tree': _et.Query<d_iwt.Parameters, d_iwt.Result, d_iwt.Error>
    'git': _et.Query<d_eqe.Parameters, d_eqe.Result, d_eqe.Error>
}

export type Query = _et.Query_Procedure<Parameters, Result, Error, Resources>