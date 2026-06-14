import * as pqi from 'pareto-core/dist/query_interface'

import * as resources_pareto from "pareto-resources/dist/interface/resources"

import * as d_is_repository_clean from "./to_be_generated/is_repository_clean"
import * as d_is_inside_work_tree from "./to_be_generated/is_inside_work_tree"

export namespace queries {

    export type is_repository_clean = pqi.Query<d_is_repository_clean.Result, d_is_repository_clean.Error, d_is_repository_clean.Parameters>
    export type is_inside_work_tree = pqi.Query<d_is_inside_work_tree.Result, d_is_inside_work_tree.Error, d_is_inside_work_tree.Parameters>

}

export namespace query_functions {

    export type is_inside_work_tree = pqi.Query_Function<
        queries.is_inside_work_tree,
        null,
        {
            'git': resources_pareto.execute_sandboxed.queries.query_executable
        }
    >

    export type is_repository_clean = pqi.Query_Function<
        queries.is_repository_clean,
        null,
        {
            'is inside git work tree': queries.is_inside_work_tree
            'git': resources_pareto.execute_sandboxed.queries.query_executable
        }
    >

}