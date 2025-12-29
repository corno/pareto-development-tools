import * as _pi from 'pareto-core-interface'

import * as d_log from "exupery-resources/dist/interface/generated/pareto/schemas/log/data_types/source"
import * as d_path from "exupery-resources/dist/interface/generated/pareto/schemas/path/data_types/target"
import * as d_read_directory from "exupery-resources/dist/interface/generated/pareto/schemas/read_directory/data_types/source"
import * as d_read_file from "exupery-resources/dist/interface/generated/pareto/schemas/read_file/data_types/source"
import * as d_directory_content from "exupery-resources/dist/interface/to_be_generated/read_directory_content"

export type Parameters = {
    'path': d_path.Context_Path,
}

export type Packages = _pi.Dictionary<d_directory_content.Result>

export type Package_Error =
    | ['not a directory', null]
    | ['directory content', d_directory_content.Error]

export type Error =
    | ['read directory', d_read_directory.Error]
    | ['directory content processing', _pi.Dictionary<Package_Error>]
    | ['log', null]
