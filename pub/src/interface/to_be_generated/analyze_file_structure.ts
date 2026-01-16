import * as _pi from 'pareto-core-interface'

import * as d_log from "pareto-resources/dist/interface/generated/pareto/schemas/log/data"
import * as d_path from "pareto-resources/dist/interface/generated/pareto/schemas/path/data"
import * as d_read_directory from "pareto-resources/dist/interface/generated/pareto/schemas/read_directory/data"
import * as d_read_file from "pareto-resources/dist/interface/generated/pareto/schemas/read_file/data"
import * as d_directory_content from "pareto-resources/dist/interface/to_be_generated/read_directory_content"

export type Parameters = {
    'path to project': d_path.Context_Path,
}

export type Packages = _pi.Dictionary<d_directory_content.Result>

export type Package_Error =
    | ['not a directory', null]
    | ['directory content', d_directory_content.Error]

export type Error =
    | ['read directory', d_read_directory.Error]
    | ['directory content processing', _pi.Dictionary<Package_Error>]
    | ['log', null]
