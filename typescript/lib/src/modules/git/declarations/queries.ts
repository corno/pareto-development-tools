import * as p_ from 'pareto-core/interface/query_implementation'

import * as queries_actions from "../../version_control_api/interface/queries.js"
import type * as query_interfaces_pareto_resources from "pareto-resources/interface/queries"

export type is_inside_work_tree = p_.Query_Implementation<
    queries_actions.is_inside_work_tree,
    null,
    {
        'git': query_interfaces_pareto_resources.execute_sandboxed.query_executable
    }
>

export type repository_no_open_changes = p_.Query_Implementation<
    queries_actions.repository_no_open_changes,
    null,
    {
        'is inside work tree': queries_actions.is_inside_work_tree,
        'git': query_interfaces_pareto_resources.execute_sandboxed.query_executable
    }
>
