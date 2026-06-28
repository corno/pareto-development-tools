import * as p_ from 'pareto-core/dist/interface/data'

import * as d_eqe from "pareto-resources/dist/interface/generated/liana/schemas/execute_sandboxed_query_executable/data"
import * as d_iwt from "./is_inside_work_tree"
import * as d_path from "pareto-resources/dist/interface/generated/liana/schemas/fs_unrestricted_path/data"

export type Result = boolean

export type Error =
    | ['could not determine status', d_eqe.Error]
    | ['not a repository', null]
    | ['unknown issue', d_iwt.Error]

export type Parameters = {
    'path': p_.Optional_Value<d_path.Context_Path>,
}