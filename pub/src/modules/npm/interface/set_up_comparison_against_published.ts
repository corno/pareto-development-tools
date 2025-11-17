import * as _et from 'exupery-core-types'

import * as d_epe from "exupery-resources/dist/interface/generated/pareto/schemas/execute_procedure_executable/data_types/source"
import * as d_eqe from "exupery-resources/dist/interface/generated/pareto/schemas/execute_query_executable/data_types/source"
import * as d_make_directory from "exupery-resources/dist/interface/generated/pareto/schemas/make_directory/data_types/source"
import * as d_read_file from "exupery-resources/dist/interface/generated/pareto/schemas/read_file/data_types/source"

export type Parameters = {
    'path to local package': _et.Optional_Value<string>,
    'path to output directory': string,
}

export type Error =
    | readonly ['error while running npm command', d_epe.Error]
    | readonly ['error while running npm query', d_eqe.Error]
    | readonly ['error while running tar', d_epe.Error]
    | readonly ['error while creating directory', d_make_directory.Error]
    | readonly ['error while reading package.json', d_read_file.Error]
    | readonly ['error while parsing package.json', string]

export type Resources = {
    'commands': {
        'npm': _et.Command<d_epe.Parameters, d_epe.Error>
        'tar': _et.Command<d_epe.Parameters, d_epe.Error>
        'make directory': _et.Command<d_make_directory.Parameters, d_make_directory.Error>
    }
    'queries': {
        'read file': _et.Data_Preparer<d_read_file.Parameters, d_read_file.Result, d_read_file.Error>
        'npm': _et.Data_Preparer<d_eqe.Parameters, d_eqe.Result, d_eqe.Error>
    }
}

export type Procedure = _et.Command_Procedure<Parameters, Error, Resources>