import * as _et from 'exupery-core-types'

import * as d_epe from "exupery-resources/dist/interface/generated/pareto/schemas/execute_procedure_executable/data_types/source"
import * as d_eqe from "exupery-resources/dist/interface/generated/pareto/schemas/execute_query_executable/data_types/source"
import * as d_make_directory from "exupery-resources/dist/interface/generated/pareto/schemas/make_directory/data_types/source"
import * as d_remove from "exupery-resources/dist/interface/generated/pareto/schemas/remove/data_types/source"
import * as d_read_file from "exupery-resources/dist/interface/generated/pareto/schemas/read_file/data_types/source"
import * as d_path from "exupery-resources/dist/interface/generated/pareto/schemas/path/data_types/source"

export type Parameters = {
    'path to local package': d_path.Context_Path,
    'path to temp directory': d_path.Node_Path,
    'path to output published directory': d_path.Node_Path,
    'path to output local directory': d_path.Node_Path,
}

export type Error =
    | readonly ['error while running npm command', d_epe.Error]
    | readonly ['error while running npm query', d_eqe.Error]
    | readonly ['error while running tar', d_epe.Error]
    | readonly ['error while creating directory', d_make_directory.Error]
    | readonly ['error while removing directory', d_remove.Error]
    | readonly ['error while reading package.json', d_read_file.Error]
    | readonly ['error while parsing package.json', string]

export type Query_Resources = {
    'read file': _et.Query<d_read_file.Result, d_read_file.Error, d_read_file.Parameters>
    'npm': _et.Query<d_eqe.Result, d_eqe.Error, d_eqe.Parameters>
}

export type Command_Resources = {
    'npm': _et.Command<d_epe.Error, d_epe.Parameters>
    'tar': _et.Command<d_epe.Error, d_epe.Parameters>
    'make directory': _et.Command<d_make_directory.Error, d_make_directory.Parameters>
    'remove' : _et.Command<d_remove.Error, d_remove.Parameters>
}

export type Signature = _et.Command_Procedure<Error, Parameters, Command_Resources, Query_Resources>