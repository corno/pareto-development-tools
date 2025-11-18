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

export type Variable_Resources = {
    'read file': _et.Stager<d_read_file.Result, d_read_file.Error, d_read_file.Parameters>
    'npm': _et.Stager<d_eqe.Result, d_eqe.Error, d_eqe.Parameters>
}

export type Command_Resources = {
    'npm': _et.Command<d_epe.Error, d_epe.Parameters>
    'tar': _et.Command<d_epe.Error, d_epe.Parameters>
    'make directory': _et.Command<d_make_directory.Error, d_make_directory.Parameters>
}

export type Procedure = _et.Command_Procedure<Error, Parameters, Command_Resources, Variable_Resources>