import * as p_ from 'pareto-core/interface/data'

import type * as s_eqe from "./execute_sandboxed_query_executable.js"
import type * as s_iwt from "./is_inside_work_tree.js"
import type * as s_path from "./fs_unrestricted_path.js"

export type Result = boolean

export type Error =
    | ['could not determine status', s_eqe.Error]
    | ['not a repository', null]
    | ['unknown issue', s_iwt.Error]

export type Parameters = {
    'path': p_.Optional_Value<s_path.Context_Path>,
}