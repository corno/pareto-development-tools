import * as _et from 'exupery-core-types'

import * as d_gic from "../queries/git_is_clean"
// import * as d_eqe from "exupery-resources/dist/interface/generated/pareto/schemas/execute_query_executable/data_types/source"
import * as d_epe from "exupery-resources/dist/interface/generated/pareto/schemas/execute_procedure_executable/data_types/source"
import * as d_is_git_clean from "../queries/git_is_clean"
import * as d_path from "exupery-resources/dist/interface/generated/pareto/schemas/path/data_types/target"

export type Parameters = {
    'path': _et.Optional_Value<d_path.Context_Path>,
}

export type Error =
    | ['unexpected error', d_gic.Error]
    | ['working directory is not clean', null]

export type Query_Resources = {
    'is git clean': _et.Query<d_is_git_clean.Result, d_is_git_clean.Error, d_is_git_clean.Parameters>
}

export type Command_Resources = {
    'git': _et.Command<d_epe.Error, d_epe.Parameters>
}

export type Procedure = _et.Command_Procedure<Error, Parameters, Command_Resources, Query_Resources>