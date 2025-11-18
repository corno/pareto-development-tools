import * as _et from 'exupery-core-types'

import * as d_main from "exupery-resources/dist/interface/temp_main"
import * as d_api from "./api"


export type Parameters = d_main.Parameters

export type Parse_Error =
    | ['expected one of', _et.Dictionary<null>]
    | ['expected a text', {
        'description': string
    }]

export type Error = d_main.Error

export type Variable_Resources = null

export type Command_Resources = {
        'api': _et.Command<d_api.Error, d_api.Parameters>

}


export type Procedure =  _et.Command_Procedure<Error, Parameters, Command_Resources, Variable_Resources>