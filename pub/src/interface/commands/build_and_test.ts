import * as _et from 'exupery-core-types'

import * as d_epe from "exupery-resources/dist/interface/generated/pareto/schemas/execute_procedure_executable/data_types/source"
import * as d_build from "./build"

export type Parameters = {
    'path': string,
}

export type Error =
    | ['error building', d_build.Error]
    | ['error testing', d_epe.Error]


export type Query_Resources = null


export type Command_Resources = {
    'build': _et.Command<d_build.Error, d_build.Parameters>
    'node': _et.Command<d_epe.Error, d_epe.Parameters>
}

export type Procedure = _et.Command_Procedure<Error, Parameters, Command_Resources, Query_Resources>