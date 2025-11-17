import * as _et from 'exupery-core-types'

import * as d_tsc from "./tsc"

export type Parameters = {
    'path': string,
}

export type Error =
    | ['error building pub', d_tsc.Error]
    | ['error building test', d_tsc.Error]


export type Resources = {
    'commands': {
        'tsc': _et.Command<d_tsc.Parameters, d_tsc.Error>
    }
}

export type Procedure =  _et.Command_Procedure<Parameters, Error, Resources>