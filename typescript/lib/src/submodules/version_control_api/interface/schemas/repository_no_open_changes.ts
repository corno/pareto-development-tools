import * as p_ from 'pareto-core/interface/data'

import type * as s_eqe from "pareto-resources/interface/data/execute_sandboxed_query_executable"
import type * as s_iwt from "./is_inside_work_tree.js"
import type * as s_path from "pareto-resources/interface/data/fs_unrestricted_path"

export type Result = boolean

export type Error =
    | ['could not determine status', s_eqe.Error]
    | ['not a repository', null]
    | ['unknown issue', s_iwt.Error]

export type Parameters = {
    'path': p_.Optional_Value<s_path.Context_Path>,
}