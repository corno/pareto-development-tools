import * as p_ from 'pareto-core/interface/query'

import type * as actions_queries_pareto_filesystem_unrestricted_api from "pareto-filesystem-unrestricted-api/interface/query_actions"
import * as query_actions from "../actions/queries.js"


    export type get_project_files = p_.Query<
        query_actions.get_project_files,
        null,
        {
            'read directory': actions_queries_pareto_filesystem_unrestricted_api.read_directory,
            'read file': actions_queries_pareto_filesystem_unrestricted_api.read_file

        }
    >

    export type get_package_dependencies = p_.Query<
        query_actions.get_package_dependencies,
        null,
        {
            'read directory': actions_queries_pareto_filesystem_unrestricted_api.read_directory,
            'read file': actions_queries_pareto_filesystem_unrestricted_api.read_file

        }
    >