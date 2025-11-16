import * as _et from 'exupery-core-types'

import * as d_update2latest from "./update2latest"

import * as d_gc from "./git_clean"
import * as d_npm from "./npm"
import * as d_epe from "exupery-resources/dist/interface/generated/pareto/schemas/execute_procedure_executable/data_types/source"

export type Parameters = {
    'path': string,
}

export type Error =
    | ['could not clean', d_gc.Error]
    | ['could not update to latest', d_update2latest.Error]
    | ['could not install', d_npm.Error]

export type Resources = {
    'procedures': {
        'git': _et.Unguaranteed_Procedure_Primed_With_Resources<d_epe.Parameters, d_epe.Error>
        'npm': _et.Unguaranteed_Procedure_Primed_With_Resources<d_epe.Parameters, d_epe.Error>
        'update2latest': _et.Unguaranteed_Procedure_Primed_With_Resources<d_epe.Parameters, d_epe.Error>
    }
}