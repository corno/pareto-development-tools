import * as p_ from 'pareto-core/interface/data'

import type * as d_epe from "pareto-resources/interface/data/execute_sandboxed_command_executable"
import type * as d_path from "pareto-resources/interface/data/fs_unrestricted_path"

export type Parameters = {
    'path': p_.Optional_Value<d_path.Context_Path>,
}

export type Error =
    | ['unexpected error', d_epe.Error]
