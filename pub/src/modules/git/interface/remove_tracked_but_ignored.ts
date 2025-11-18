import * as _et from 'exupery-core-types'
import * as _easync from 'exupery-core-async'


import * as d_eqe from "exupery-resources/dist/interface/generated/pareto/schemas/execute_query_executable/data_types/source"
import * as d_epe from "exupery-resources/dist/interface/generated/pareto/schemas/execute_procedure_executable/data_types/source"
import * as d_gac from "./assert-clean"
import * as d_gic from "../../../interface/temp/queries/git_is_clean"

export type Parameters = {
    'path': _et.Optional_Value<string>,
}

export type Error =
    | ['not clean', null]
    | ['could not remove', d_eqe.Error]
    | ['could not add', d_eqe.Error]
    | ['unexpected error', d_gic.Error]

export type Variable_Resources = {
    'git': _et.Stager<d_eqe.Result, d_eqe.Error, d_eqe.Parameters>
}

export type Command_Resources = {
    'git': _et.Command<d_epe.Error, d_epe.Parameters>
    'assert git is clean': _et.Command<d_gac.Error, d_gac.Parameters>
}

export type Procedure = _et.Command_Procedure<Error, Parameters, Command_Resources, Variable_Resources>