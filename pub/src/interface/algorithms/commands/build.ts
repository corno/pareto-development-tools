import * as _et from 'exupery-core-types'

import * as d_tsc from "./tsc"
import * as d_remove from "exupery-resources/dist/interface/generated/pareto/schemas/remove/data_types/source"
import * as d_path from "exupery-resources/dist/interface/generated/pareto/schemas/path/data_types/target"

export type Parameters = {
    'path': d_path.Node_Path,
}

export type Error =
    | ['error building pub', d_tsc.Error]
    | ['error building test', d_tsc.Error]
    | ['error removing pub dist dir', d_remove.Error]
    | ['error removing test dist dir', d_remove.Error]


export type Query_Resources = null

export type Command_Resources = {
        'tsc': _et.Command<d_tsc.Error, d_tsc.Parameters>
        'remove': _et.Command<d_remove.Error, d_remove.Parameters>
}

export type Signature =  _et.Command_Procedure<Error, Parameters, Command_Resources, Query_Resources>