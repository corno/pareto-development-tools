import * as p_ from 'pareto-core/implementation/query'
import p_variables from 'pareto-core/implementation/query/specials/variables'
import p_super_query_result from 'pareto-core/implementation/query/super_query_result'

import type * as query_interfaces from "../../interface/queries.js"
import type * as query_interfaces_pareto_filesystem_unrestricted_api from "pareto-filesystem-unrestricted-api/modules/unrestricted/interface/queries"

//schemas
import * as d from "../../interface/schemas/get_package_json.js"

//dependencies
import * as t_path_to_path from "pareto-resources/implementation/transformers/unrestricted_path/unrestricted_path"
import { NPM_Package as r_parse_npm_package } from "../refiners/npm_package/list_of_characters.js"

export const $$: p_.Query_Implementation<
    query_interfaces.get_package_json,
    null,
    {
        'read file': query_interfaces_pareto_filesystem_unrestricted_api.read_file,
    }
> = p_.query(
    ($d, $s, $r) => p_variables(
        () => {
            const path = t_path_to_path.create_node_path($d['path to package'], { 'node': "package.json" })
            return p_super_query_result($r['read file'](
                path,
                ($): d.Error => ['error while reading package.json', $],
            )).refine(
                ($, abort) => r_parse_npm_package(
                    $.data,
                    ($) => abort(['error while parsing package.json', {
                        'type': $,
                        'path': path,
                    }]),
                )
            )
        })
)

