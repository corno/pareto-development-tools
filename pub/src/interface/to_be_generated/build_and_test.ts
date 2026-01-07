import * as _pi from 'pareto-core-interface'

import * as d_epe from "pareto-resources/dist/interface/generated/pareto/schemas/execute_procedure_executable/data_types/source"
import * as d_build from "./build"
import * as d_path from "pareto-resources/dist/interface/generated/pareto/schemas/path/data_types/target"

export type Parameters = {
    'path': d_path.Context_Path,
}

export type Error =
    | ['error building', d_build.Error]
    | ['error testing', d_epe.Error]
