import * as _et from 'exupery-core-types'

import * as d_epe from "exupery-resources/dist/interface/generated/pareto/schemas/execute_procedure_executable/data_types/source"

export type Parameters = {
    'path': _et.Optional_Value<string>,
}

export type Error =
    | ['unexpected error', d_epe.Error]

export type Query_Resources = null

export type Command_Resources = {
        'git': _et.Command<d_epe.Error, d_epe.Parameters>
}

export type Procedure =  _et.Command_Procedure<Error, Parameters, Command_Resources, Query_Resources>