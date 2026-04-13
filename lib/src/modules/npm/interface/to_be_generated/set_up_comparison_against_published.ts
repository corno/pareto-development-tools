import * as _pi from 'pareto-core/dist/interface'

import * as d_epe from "pareto-resources/dist/interface/generated/liana/schemas/execute_command_executable/data"
import * as d_eqe from "pareto-resources/dist/interface/generated/liana/schemas/execute_query_executable/data"
import * as d_make_directory from "pareto-resources/dist/interface/generated/liana/schemas/make_directory/data"
import * as d_remove from "pareto-resources/dist/interface/generated/liana/schemas/remove/data"
import * as d_path from "pareto-resources/dist/interface/generated/liana/schemas/path/data"
import * as d_get_package_json from "./get_package_json"

export type Parameters = {
    'path to local package': d_path.Context_Path,
    'path to temp directory': d_path.Node_Path,
    'path to output published directory': d_path.Node_Path,
    'path to output local directory': d_path.Node_Path,
}

export type Error =
    | readonly ['error while getting package.json', d_get_package_json.Error]
    | readonly ['error while running npm command', d_epe.Error]
    | readonly ['error while running npm query', d_eqe.Error]
    | readonly ['error while running tar', d_epe.Error]
    | readonly ['error while creating directory', d_make_directory.Error]
    | readonly ['error while removing directory', d_remove.Error]
