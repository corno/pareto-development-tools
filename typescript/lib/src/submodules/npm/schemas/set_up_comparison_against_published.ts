
import type * as s_epe from "pareto-resources/schemas/execute_sandboxed_command_executable/schema"
import type * as s_eqe from "pareto-resources/schemas/execute_sandboxed_query_executable/schema"
import type * as s_make_directory from "pareto-filesystem-unrestricted-api/modules/unrestricted/schemas/make_directory/schema"
import type * as s_path from "pareto-resources/schemas/fs_unrestricted_path/schema"
import type * as s_get_package_json from "./get_package_json.js"

export type Parameters = {
    'path to local package': s_path.Context_Path,
    'path to temp directory': s_path.Node_Path,
    'path to output published directory': s_path.Node_Path,
    'path to output local directory': s_path.Node_Path,
}

export type Error =
    | readonly ['error while getting package.json', s_get_package_json.Error]
    | readonly ['error while running npm command', s_epe.Error]
    | readonly ['error while running npm query', s_eqe.Error]
    | readonly ['error while running tar', s_epe.Error]
    | readonly ['error while creating directory', s_make_directory.Error]
