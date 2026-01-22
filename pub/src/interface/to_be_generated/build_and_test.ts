import * as _pi from 'pareto-core/dist/interface'

import * as d_epe from "pareto-resources/dist/interface/generated/pareto/schemas/execute_command_executable/data"
import * as d_build from "./build"
import * as d_path from "pareto-resources/dist/interface/generated/pareto/schemas/path/data"

export type Parameters = {
    'path': d_path.Context_Path,
}

export type Error =
    | ['error building', d_build.Error]
    | ['error testing', d_epe.Error]
