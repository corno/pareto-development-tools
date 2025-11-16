import * as _et from 'exupery-core-types'
import * as _easync from 'exupery-core-async'

import * as d_eqe from "exupery-resources/dist/interface/generated/pareto/schemas/execute_query_executable/data_types/source"
import * as d_iwt from "./git_is_inside_work_tree"
import * as d_epe from "exupery-resources/dist/interface/generated/pareto/schemas/execute_procedure_executable/data_types/source"

export type Parameters = {
    'path': _et.Optional_Value<string>,
}

export type Result = boolean

export type Error =
    | ['could not determine git status', d_eqe.Error]
    | ['not a git repository', null]
    | ['unknown issue', d_iwt.Error]

export type Resources = {
    'queries': {
        'git': _et.Unguaranteed_Query_Primed_With_Resources<d_eqe.Parameters, d_eqe.Result, d_eqe.Error>
    }
    'procedures': {
        'git': _et.Unguaranteed_Procedure_Primed_With_Resources<d_epe.Parameters, d_epe.Error>
    }
}