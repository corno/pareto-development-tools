import * as _et from 'exupery-core-types'
import * as _easync from 'exupery-core-async'

import * as d_eqe from "exupery-resources/dist/interface/generated/pareto/schemas/execute_query_executable/data_types/source"


export type Parameters = {
    'path': _et.Optional_Value<string>,
}

export type Result = boolean

export type Error =
    | ['could not run git command', {
        'message': string
    }]
    | ['unexpected output', string]


export type Resources = {
    'git': _et.Query<d_eqe.Result, d_eqe.Error, d_eqe.Parameters>
}

export type Query = _et.Query_Procedure<Result, Error, Parameters, Resources>