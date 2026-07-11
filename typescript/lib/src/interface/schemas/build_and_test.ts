
import type * as s_epe from "pareto-resources/interface/data/execute_sandboxed_command_executable"
import type * as s_build from "./build.js"
import type * as s_path from "pareto-resources/interface/data/fs_unrestricted_path"

export type Parameters = {
    'path': s_path.Context_Path,
}

export type Error =
    | ['error building', s_build.Error]
    | ['error testing', s_epe.Error]
