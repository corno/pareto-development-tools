import * as _et from 'exupery-core-types'

import * as d_tsc from "./tsc"
import * as d_remove from "exupery-resources/dist/interface/generated/pareto/schemas/remove/data_types/source"
import * as d_path from "exupery-resources/dist/interface/generated/pareto/schemas/path/data_types/target"

export type Parameters = {
    'path': d_path.Node_Path,
}

export type Error =
    | ['error building pub', {
        'path': string
        'error': d_tsc.Error
    }]
    | ['error building test', {
        'path': string
        'error': d_tsc.Error
    }]
    | ['error removing pub dist dir', {
        'path': string
        'error': d_remove.Error
    }]
    | ['error removing test dist dir', {
        'path': string
        'error': d_remove.Error
    }]

export type Query_Resources = null

export type Command_Resources = {
    'tsc': _et.Command<d_tsc.Error, d_tsc.Parameters>
    'remove': _et.Command<d_remove.Error, d_remove.Parameters>
}

export type Signature = _et.Command_Procedure<_et.Command<Error, Parameters>, Command_Resources, Query_Resources>