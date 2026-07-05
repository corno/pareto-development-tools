import * as p_ from 'pareto-core/interface/query'

import * as resources_pareto from "pareto-resources/interface/resources"

import * as queries from "../../version_control_api/interface/queries.js"

export namespace query_functions {

    export type is_inside_work_tree = p_.Query_Function<
        queries.queries.is_inside_work_tree,
        null,
        {
            'git': resources_pareto.execute_sandboxed.queries.query_executable
        }
    >

    export type repository_no_open_changes = p_.Query_Function<
        queries.queries.repository_no_open_changes,
        null,
        {
            'is inside work tree': queries.queries.is_inside_work_tree,
            'git': resources_pareto.execute_sandboxed.queries.query_executable
        }
    >

}