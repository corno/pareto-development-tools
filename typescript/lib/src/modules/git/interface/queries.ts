import * as p_ from 'pareto-core/interface/query'

import * as queries_actions from "../../version_control_api/interface/query_actions.js"
import * as query_actions_pareto_resources from "pareto-resources/interface/query_actions"

export type is_inside_work_tree = p_.Query_Function<
    queries_actions.is_inside_work_tree,
    null,
    {
        'git': query_actions_pareto_resources.execute_sandboxed.query_executable
    }
>

export type repository_no_open_changes = p_.Query_Function<
    queries_actions.repository_no_open_changes,
    null,
    {
        'is inside work tree': queries_actions.is_inside_work_tree,
        'git': query_actions_pareto_resources.execute_sandboxed.query_executable
    }
>
