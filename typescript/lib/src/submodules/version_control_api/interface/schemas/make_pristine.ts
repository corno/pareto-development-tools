import * as p_ from 'pareto-core/interface/data'

import type * as s_epe from "./execute_sandboxed_command_executable.js"
import type * as s_path from "./fs_unrestricted_path.js"

export type Parameters = {
    'path': p_.Optional_Value<s_path.Context_Path>,
}

export type Error =
    | ['unexpected error', s_epe.Error]
