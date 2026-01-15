import * as _pi from 'pareto-core-interface'

import * as d_epe from "pareto-resources/dist/interface/generated/pareto/schemas/execute_command_executable/data_types/source"
import * as d_eqe from "pareto-resources/dist/interface/generated/pareto/schemas/execute_query_executable/data_types/source"
import * as d_make_directory from "pareto-resources/dist/interface/generated/pareto/schemas/make_directory/data_types/source"
import * as d_remove from "pareto-resources/dist/interface/generated/pareto/schemas/remove/data_types/source"
import * as d_read_file from "pareto-resources/dist/interface/generated/pareto/schemas/read_file/data_types/source"
import * as d_path from "pareto-resources/dist/interface/generated/pareto/schemas/path/data_types/source"
import * as d_deserialize_package_json from "./deserialize_package_json"

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
    | readonly ['error while parsing package.json', d_deserialize_package_json.Error]
