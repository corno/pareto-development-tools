import * as p_ from 'pareto-core/interface/query_implementation'

import type * as query_interfaces_pareto_filesystem_unrestricted_api from "pareto-filesystem-unrestricted-api/interface/queries"
import type * as query_interfaces from "../interface/queries.js"


export type get_package_json = p_.Query_Implementation<
    query_interfaces.get_package_json,
    null,
    {
        'read file': query_interfaces_pareto_filesystem_unrestricted_api.read_file
    }
>