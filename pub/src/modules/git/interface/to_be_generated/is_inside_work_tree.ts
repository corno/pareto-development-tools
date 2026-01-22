import * as _pi from 'pareto-core/dist/interface'

import * as d_eqe from "pareto-resources/dist/interface/generated/pareto/schemas/execute_query_executable/data"

import * as d_path from "pareto-resources/dist/interface/generated/pareto/schemas/path/data"

export type Parameters = {
    'path': _pi.Optional_Value<d_path.Context_Path>,
}

export type Result = boolean

export type Error =
    | ['could not run git command', {
        'message': string
    }]
    | ['unexpected output', string]
