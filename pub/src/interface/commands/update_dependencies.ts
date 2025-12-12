import * as _et from 'exupery-core-types'

import * as d_utd from "./clean_and_update_dependencies"


export type Parameters = {
    'path': string,
}

export type Error =
    | ['error updating pub', d_utd.Error]
    | ['error updating test', d_utd.Error]

export type Query_Resources = null

export type Command_Resources = {
        'clean and update dependencies': _et.Command<d_utd.Error, d_utd.Parameters>
}

export type Procedure =  _et.Command_Procedure<Error, Parameters, Command_Resources, Query_Resources>