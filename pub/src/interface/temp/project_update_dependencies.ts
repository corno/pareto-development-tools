import * as _et from 'exupery-core-types'

import * as d_epe from "exupery-resources/dist/interface/generated/pareto/schemas/execute_procedure_executable/data_types/source"
import * as d_write_to_stderr from "exupery-resources/dist/interface/generated/pareto/schemas/write_to_stderr/data_types/source"
import * as d_utd from "./update_typescript_dependencies"


export type Parameters = {
    'path': string,
}

export type Error =
    | ['error building pub', d_utd.Error]
    | ['error building test', d_utd.Error]


export type Resources = {
    'procedures': {
        'git': _et.Unguaranteed_Procedure_Primed_With_Resources<d_epe.Parameters, d_epe.Error>
        'npm': _et.Unguaranteed_Procedure_Primed_With_Resources<d_epe.Parameters, d_epe.Error>
        'update2latest': _et.Unguaranteed_Procedure_Primed_With_Resources<d_epe.Parameters, d_epe.Error>
        'write to stderr': _et.Guaranteed_Procedure_Primed_With_Resources<d_write_to_stderr.Parameters>
    }

}
