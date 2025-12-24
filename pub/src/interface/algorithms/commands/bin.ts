import * as _et from 'exupery-core-types'

import * as d_main from "exupery-resources/dist/interface/to_be_generated/temp_main"
import * as d_api from "./api"


export type Parameters = d_main.Parameters

export type Error = d_main.Error

export type Query_Resources = null

export type Command_Resources = {
        'api': _et.Command<d_api.Error, d_api.Parameters>

}

export type Procedure =  _et.Command_Procedure<_et.Command<Error, Parameters>, Command_Resources, Query_Resources>