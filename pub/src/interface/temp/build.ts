import * as _easync from 'exupery-core-async'

import * as d_espe from "exupery-resources/dist/interface/generated/pareto/schemas/execute_smelly_procedure_executable/data_types/source"
import * as d_tsc from "./tsc"

export type Parameters = {
    'path': string,
}

export type Error =
    | ['error building pub', d_tsc.Error]
    | ['error building test', d_tsc.Error]


export type Resources = {
    'procedures': {
        'tsc': _easync.Unguaranteed_Procedure<d_espe.Parameters, d_espe.Error, null>
    }
}