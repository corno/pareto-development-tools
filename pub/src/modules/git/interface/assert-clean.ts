import * as _et from 'exupery-core-types'

import * as d_gic from "../../../interface/temp/queries/git_is_clean"
// import * as d_eqe from "exupery-resources/dist/interface/generated/pareto/schemas/execute_query_executable/data_types/source"
import * as d_epe from "exupery-resources/dist/interface/generated/pareto/schemas/execute_procedure_executable/data_types/source"
import * as d_is_git_clean from "../../../interface/temp/queries/git_is_clean"

export type Parameters = {
    'path': _et.Optional_Value<string>,
}

export type Error =
    | ['unexpected error', d_gic.Error]
    | ['working directory is not clean', null]

export type Resources = {
    'queries': {
        'is git clean': _et.Data_Preparer<d_is_git_clean.Parameters, d_is_git_clean.Result, d_is_git_clean.Error>
    }
    'commands': {
        'git': _et.Command<d_epe.Parameters, d_epe.Error>
    }
}

export type Procedure = _et.Command_Procedure<Parameters, Error, Resources>