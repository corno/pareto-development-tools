import * as p_ from 'pareto-core/interface/schema'

import type * as s_eqe from "pareto-resources/schemas/execute_sandboxed_query_executable/schema"
import type * as s_iwt from "../is_inside_work_tree/schema.js"
import type * as s_path from "pareto-resources/schemas/fs_unrestricted_path/schema"

export type Result = boolean

export type Error =
    | ['could not determine status', s_eqe.Error]
    | ['not a repository', null]
    | ['unknown issue', s_iwt.Error]

export type Parameters = {
    'path': p_.Optional_Value<s_path.Context_Path>,
}