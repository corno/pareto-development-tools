
import type * as d_epe from "pareto-resources/interface/generated/liana/schemas/execute_sandboxed_command_executable/data"
import type * as d_build from "./build.js"
import type * as d_path from "pareto-resources/interface/generated/liana/schemas/fs_unrestricted_path/data"

export type Parameters = {
    'path': d_path.Context_Path,
}

export type Error =
    | ['error building', d_build.Error]
    | ['error testing', d_epe.Error]
