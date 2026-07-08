import * as p_ from 'pareto-core/implementation/query'
import p_super_query_result from 'pareto-core/implementation/query/super_query_result'


import * as interface_ from "../../../interface/declarations/queries.js"

//data types
import * as d from "../../../interface/data/get_package_dependencies.js"
import type * as d_npm_package from "../../../modules/npm/interface/data/npm_package.js"

//dependencies
import * as t_path_to_path from "pareto-resources/implementation/manual/transformers/unrestricted_path/unrestricted_path"
import { NPM_Package as r_parse_npm_package } from "../../../modules/npm/implementation/manual/refiners/npm_package/list_of_characters.js"

export const $$: interface_.get_package_dependencies = p_.query(
    ($d, $s, $q) => p_super_query_result($q['read directory'](
        {
            'path': t_path_to_path.extend_context_path_with_single_step($d['path'], { 'addition': "packages" }),
        },
        ($): d.Error => ['read directory', $],
    )).query(
        ($) => p_super_query_result(p_.e.dictionary(
            $,
            ($) => {
                const lib_path = t_path_to_path.extend_context_path_with_list(
                    t_path_to_path.deprecated_node_path_to_context_path($.path),
                    {
                        'addition': p_.literal.list(["typescript", "lib"])
                    }
                )
                const package_json_path = t_path_to_path.create_node_path(lib_path, { 'node': "package.json" })
                return p_.decide.state($['node type'], ($) => {
                    switch ($[0]) {
                        case 'file': return p_.option($, ($) => p_.e.direct_error<d_npm_package.NPM_Package, d.Package_Error>(['not a directory', null]))
                        case 'other': return p_.option($, ($) => p_.e.direct_error<d_npm_package.NPM_Package, d.Package_Error>(['not a directory', null]))
                        case 'directory': return p_.option($, ($) => p_super_query_result($q['read file'](
                            package_json_path,
                            ($): d.Package_Error => ['no package.json file', null],
                        )).refine(
                            ($, abort) => r_parse_npm_package(
                                $,
                                ($) => abort(['parse error', {
                                    'type': $,
                                    'path': package_json_path,
                                }]),
                            )
                        ))
                        default: return p_.exhaustive($[0])
                    }
                })
            },
            ($): d.Error => ['directory content processing', $],
        )).transform(
            ($) => ({
                'packages': $,
            })
        )
    )
)
