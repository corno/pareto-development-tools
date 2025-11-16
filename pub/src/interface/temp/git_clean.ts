import * as _et from 'exupery-core-types'

import * as d_epe from "exupery-resources/dist/interface/generated/pareto/schemas/execute_procedure_executable/data_types/source"

export type Parameters = {
    'path': _et.Optional_Value<string>,
}

export type Error =
    | ['unexpected error', d_epe.Error]

export type Resources = {
    'procedures': {
        'git': _et.Unguaranteed_Procedure_Primed_With_Resources<d_epe.Parameters, d_epe.Error>
    }
}