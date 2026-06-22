import * as p_ from 'pareto-core/dist/implementation/query'
import p_variables from 'pareto-core/dist/implementation/query/specials/variables'
import p_super_query_result from 'pareto-core/dist/implementation/query/super_query_result'

import * as interface_ from "../../../interface/queries"

//data types
import * as d from "../../../interface/data/get_package_json"

//dependencies
import * as t_path_to_path from "pareto-resources/dist/implementation/manual/transformers/unrestricted_path/unrestricted_path"
import * as t_path_to_text from "pareto-resources/dist/implementation/manual/transformers/unrestricted_path/text"
import { NPM_Package as r_parse_npm_package } from "../refiners/npm_package/list_of_characters"

export const $$: interface_.query_functions.get_package_json = p_.query_function(
    ($d, $s, $r) => p_variables(() => {
        const path = t_path_to_path.create_node_path($d['path to package'], { 'node': "package.json" })
        return p_super_query_result($r['read file'](
            path,
            ($): d.Error => ['error while reading package.json', $],
        )).refine(
            ($, abort) => r_parse_npm_package(
                $,
                ($) => abort(['error while parsing package.json', {
                    'type': $,
                    'path': path,
                }]),
            )
        )
    })
)

