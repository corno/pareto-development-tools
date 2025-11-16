import * as _et from 'exupery-core-types'

import * as d_utd from "./update_typescript_dependencies"


export type Parameters = {
    'path': string,
}

export type Error =
    | ['error updating pub', d_utd.Error]
    | ['error updating test', d_utd.Error]

export type Resources = {
    'commands': {
        'update typescript dependencies': _et.Command<d_utd.Parameters, d_utd.Error>
    }
}

export type Procedure =  _et.Command_Procedure<Parameters, Error, Resources>