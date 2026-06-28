import * as p_ from 'pareto-core/dist/interface/query'

import * as resources_pareto from "pareto-resources/dist/interface/resources"

import * as d_repository_no_open_changes from "./data/repository_no_open_changes"
import * as d_is_inside_work_tree from "./data/is_inside_work_tree"

export namespace queries {

    export type repository_no_open_changes = p_.Query<d_repository_no_open_changes.Result, d_repository_no_open_changes.Error, d_repository_no_open_changes.Parameters>
    export type is_inside_work_tree = p_.Query<d_is_inside_work_tree.Result, d_is_inside_work_tree.Error, d_is_inside_work_tree.Parameters>

}