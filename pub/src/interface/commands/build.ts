import * as _et from 'exupery-core-types'

import * as d_tsc from "./tsc"

export type Parameters = {
    'path': string,
}

export type Error =
    | ['error building pub', d_tsc.Error]
    | ['error building test', d_tsc.Error]


export type Variable_Resources = null

export type Command_Resources = {
        'tsc': _et.Command<d_tsc.Error, d_tsc.Parameters>
}

export type Procedure =  _et.Command_Procedure<Error, Parameters, Command_Resources, Variable_Resources>