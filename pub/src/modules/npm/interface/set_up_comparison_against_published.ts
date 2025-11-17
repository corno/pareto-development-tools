import * as _et from 'exupery-core-types'

import * as d_epe from "exupery-resources/dist/interface/generated/pareto/schemas/execute_procedure_executable/data_types/source"
import * as d_make_directory from "exupery-resources/dist/interface/generated/pareto/schemas/make_directory/data_types/source"

export type Parameters = {
    'path to local package': _et.Optional_Value<string>,
    'path to output directory': string,
}

export type Error =
    | ['error while running npm', d_epe.Error]
    | ['error while running tar', d_epe.Error]
    | ['error while creating directory', d_make_directory.Error]

export type Resources = {
    'commands': {
        'npm': _et.Command<d_epe.Parameters, d_epe.Error>
        'tar': _et.Command<d_epe.Parameters, d_epe.Error>
        'make directory': _et.Command<d_make_directory.Parameters, d_make_directory.Error>
    }
}

export type Procedure = _et.Command_Procedure<Parameters, Error, Resources>