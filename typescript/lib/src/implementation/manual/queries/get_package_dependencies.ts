import * as p_ from 'pareto-core/dist/implementation/query'
import p_super_query_result from 'pareto-core/dist/implementation/query/super_query_result'


import * as interface_ from "../../../interface/queries"

//data types
import * as d from "../../../interface/data/get_package_dependencies"
import * as d_npm_package from "../../../modules/npm/interface/data/npm_package"

//dependencies
import * as t_path_to_path from "pareto-resources/dist/implementation/manual/transformers/unrestricted_path/unrestricted_path"
import { NPM_Package as r_parse_npm_package } from "../../../modules/npm/implementation/manual/refiners/npm_package/list_of_characters"

export const $$: interface_.query_functions.get_package_dependencies = p_.query_function(
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
                        case 'file': return p_.ss($, ($) => p_.e.direct_error<d_npm_package.NPM_Package, d.Package_Error>(['not a directory', null]))
                        case 'other': return p_.ss($, ($) => p_.e.direct_error<d_npm_package.NPM_Package, d.Package_Error>(['not a directory', null]))
                        case 'directory': return p_.ss($, ($) => p_super_query_result($q['read file'](
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
                        default: return p_.au($[0])
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
