import * as p_ from 'pareto-core/interface/data'

import * as d_epe from "pareto-resources/interface/generated/liana/schemas/execute_sandboxed_command_executable/data"
import * as d_path from "pareto-resources/interface/generated/liana/schemas/fs_unrestricted_path/data"

export type Parameters = {
    'path': p_.Optional_Value<d_path.Context_Path>,
}

export type Error =
    | ['unexpected error', d_epe.Error]
