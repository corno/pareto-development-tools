import * as p_ from 'pareto-core/implementation/query'
import p_variables from 'pareto-core/implementation/query/specials/variables'
import p_super_query_result from 'pareto-core/implementation/query/super_query_result'

import type * as query_interfaces from "../interfaces.js"
import type * as query_interfaces_pareto_filesystem_unrestricted_api from "pareto-filesystem-unrestricted-api/modules/unrestricted/queries/interfaces"

//schemas
import * as d from "../../schemas/get_package_json/schema.js"

//dependencies
import * as t_path_to_path from "pareto-execute-unrestricted-api/schemas/fs_unrestricted_path/transformers/unrestricted_path"
import * as r_npm_package_from_list_of_characters from "../../schemas/npm_package/refiners/list_of_characters.js"

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
                ($, abort) => r_npm_package_from_list_of_characters.NPM_Package(
                    $.data,
                    ($) => abort(['error while parsing package.json', {
                        'type': $,
                        'path': path,
                    }]),
                )
            )
        })
)

