import * as p_ from 'pareto-core/interface/query'

import type * as actions_queries_pareto_filesystem_unrestricted_api from "pareto-filesystem-unrestricted-api/interface/query_actions"
import * as query_actions from "../actions/queries.js"


export type get_package_json = p_.Query<
    query_actions.get_package_json,
    null,
    {
        'read file': actions_queries_pareto_filesystem_unrestricted_api.read_file
    }
>