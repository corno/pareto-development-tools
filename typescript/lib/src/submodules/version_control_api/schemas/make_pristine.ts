import * as p_ from 'pareto-core/interface/schema'

import type * as s_epe from "pareto-resources/schemas/execute_sandboxed_command_executable/schema"
import type * as s_path from "pareto-resources/schemas/fs_unrestricted_path/schema"

export type Parameters = {
    'path': p_.Optional_Value<s_path.Context_Path>,
}

export type Error =
    | ['unexpected error', s_epe.Error]
