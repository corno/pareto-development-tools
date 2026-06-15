import * as p_di from 'pareto-core/dist/interface/data'

import * as d_epe from "pareto-resources/dist/interface/generated/liana/schemas/execute_sandboxed_command_executable/data"
import * as d_build from "./build"
import * as d_path from "pareto-resources/dist/interface/generated/liana/schemas/fs_unrestricted_path/data"

export type Parameters = {
    'path': d_path.Context_Path,
}

export type Error =
    | ['error building', d_build.Error]
    | ['error testing', d_epe.Error]
