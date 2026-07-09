import * as p_ from 'pareto-core/interface/query_implementation'

import type * as query_interfaces_pareto_filesystem_unrestricted_api from "pareto-filesystem-unrestricted-api/interface/queries"
import * as query_interfaces from "../interface/queries.js"


export type get_project_files = p_.Query_Implementation<
    query_interfaces.get_project_files,
    null,
    {
        'read directory': query_interfaces_pareto_filesystem_unrestricted_api.read_directory,
        'read file': query_interfaces_pareto_filesystem_unrestricted_api.read_file

    }
>

export type get_package_dependencies = p_.Query_Implementation<
    query_interfaces.get_package_dependencies,
    null,
    {
        'read directory': query_interfaces_pareto_filesystem_unrestricted_api.read_directory,
        'read file': query_interfaces_pareto_filesystem_unrestricted_api.read_file

    }
>