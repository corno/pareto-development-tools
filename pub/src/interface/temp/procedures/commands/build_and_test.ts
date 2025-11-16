import * as _et from 'exupery-core-types'

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
    'commands': {
        'build': _et.Command<d_build.Parameters, d_build.Error>
        'node': _et.Command<d_epe.Parameters, d_epe.Error>
    }
}

export type Procedure =  _et.Command_Procedure<Parameters, Error, Resources>