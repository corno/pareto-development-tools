import * as p_ from 'pareto-core/interface/query_interface'

import type * as s_repository_no_open_changes from "../schemas/repository_no_open_changes/schema.js"
import type * as s_is_inside_work_tree from "../schemas/is_inside_work_tree/schema.js"


export type repository_no_open_changes = p_.Query_Interface<
    s_repository_no_open_changes.Result,
    s_repository_no_open_changes.Error,
    s_repository_no_open_changes.Parameters
>
export type is_inside_work_tree = p_.Query_Interface<
    s_is_inside_work_tree.Result,
    s_is_inside_work_tree.Error,
    s_is_inside_work_tree.Parameters
>
