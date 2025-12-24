import * as _et from 'exupery-core-types'
import * as _easync from 'exupery-core-async'

import * as d_eqe from "exupery-resources/dist/interface/generated/pareto/schemas/execute_query_executable/data_types/source"
import * as d_gic from "../queries/git_is_clean"
import * as d_epe from "exupery-resources/dist/interface/generated/pareto/schemas/execute_procedure_executable/data_types/source"
import * as d_path from "exupery-resources/dist/interface/generated/pareto/schemas/path/data_types/target"

export type Error =
    | ['asserting git not clean', d_gic.Error]
    | ['could not stage', d_eqe.Error]
    | ['could not commit', d_eqe.Error]
    | ['could not push', d_eqe.Error]


export type Parameters = {
    'path': _et.Optional_Value<d_path.Context_Path>,
    'instruction': Instruction,
}

export type Instruction = {
    'commit message': string
    'stage all changes': boolean,
    'push after commit': boolean,

}

export type Query_Resources = {
    'git is clean': _et.Query<d_gic.Result, d_gic.Error, d_gic.Parameters>
}

export type Command_Resources = {
    'git': _et.Command<d_epe.Error, d_epe.Parameters>
}

export type Procedure = _et.Command_Procedure<_et.Command<Error, Parameters>, Command_Resources, Query_Resources>