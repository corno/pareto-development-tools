import * as _et from 'exupery-core-types'

import * as d_log from "exupery-resources/dist/interface/generated/pareto/schemas/log/data_types/source"
import * as d_path from "exupery-resources/dist/interface/generated/pareto/schemas/path/data_types/target"
import * as d_read_directory from "exupery-resources/dist/interface/generated/pareto/schemas/read_directory/data_types/source"
import * as d_read_file from "exupery-resources/dist/interface/generated/pareto/schemas/read_file/data_types/source"
import * as d_directory_content from "exupery-resources/dist/interface/algorithms/queries/read_directory_content"

export type Parameters = {
    'path': d_path.Context_Path,
}

export type Packages = _et.Dictionary<d_directory_content.Result>

export type Package_Error =
    | ['not a directory', null]
    | ['directory content', d_directory_content.Error]
    
export type Error =
    | ['read directory', d_read_directory.Error]
    | ['directory content processing', _et.Dictionary<Package_Error>]
    | ['log', null]


export type Query_Resources = {
    'read directory': _et.Query<d_read_directory.Result, d_read_directory.Error, d_read_directory.Parameters>
    'read file': _et.Query<d_read_file.Result, d_read_file.Error, d_read_file.Parameters>

}

export type Command_Resources = {
    'log': _et.Command<null, d_log.Parameters>
}

export type Signature = _et.Command_Procedure<Error, Parameters, Command_Resources, Query_Resources>