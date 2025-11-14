import * as _easync from 'exupery-core-async'

import * as d_espe from "exupery-resources/dist/interface/generated/pareto/schemas/execute_smelly_procedure_executable/data_types/source"
import * as d_epe from "exupery-resources/dist/interface/generated/pareto/schemas/execute_procedure_executable/data_types/source"
import * as d_build from "./build"

export type Parameters = {
    'path': string,
}

export type Error =
    | ['error building', d_build.Error]
    | ['error testing', d_epe.Error]


export type Resources = {
    'procedures': {
        'tsc': _easync.Unguaranteed_Procedure<d_espe.Parameters, d_espe.Error, null>
        'node': _easync.Unguaranteed_Procedure<d_epe.Parameters, d_epe.Error, null>
    }
}