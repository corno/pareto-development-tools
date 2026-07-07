import * as p_ from 'pareto-core/interface/query'

import * as query_actions_pareto_filesystem_unrestricted_api from "pareto-filesystem-unrestricted-api/interface/query_actions"
import * as query_actions from "./query_actions.js"


    export type get_project_files = p_.Query_Function<
        query_actions.get_project_files,
        null,
        {
            'read directory': query_actions_pareto_filesystem_unrestricted_api.read_directory,
            'read file': query_actions_pareto_filesystem_unrestricted_api.read_file

        }
    >

    export type get_package_dependencies = p_.Query_Function<
        query_actions.get_package_dependencies,
        null,
        {
            'read directory': query_actions_pareto_filesystem_unrestricted_api.read_directory,
            'read file': query_actions_pareto_filesystem_unrestricted_api.read_file

        }
    >