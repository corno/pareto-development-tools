import * as p_ from 'pareto-core/implementation/query'
import p_super_query_result from 'pareto-core/implementation/query/super_query_result'

import type * as query_interfaces from "../../../../queries/interfaces.js"
import type * as query_interfaces_pareto_filesystem_unrestricted_api from "pareto-filesystem-unrestricted-api/modules/unrestricted/queries/interfaces"

//schemas
import * as d from "../../schemas/get_package_dependencies.js"
import type * as s_npm_package from "../../../npm/interface/schemas/npm_package.js"

//dependencies
import * as t_path_to_path from "pareto-resources/implementation/transformers/unrestricted_path/unrestricted_path"
import { NPM_Package as r_parse_npm_package } from "../../../npm/implementation/refiners/npm_package/list_of_characters.js"

export const $$: p_.Query_Implementation<
    query_interfaces.get_package_dependencies,
    null,
    {
        'read directory': query_interfaces_pareto_filesystem_unrestricted_api.read_directory,
        'read file': query_interfaces_pareto_filesystem_unrestricted_api.read_file,
    }
> = p_.query(
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
                return p_.decide.state($['node type'], ($): p_.Query_Result<s_npm_package.NPM_Package, d.Package_Error> => {
                    switch ($[0]) {
                        case 'file': return p_.option($, ($) => p_.e.direct_error(['not a directory', null]))
                        case 'other': return p_.option($, ($) => p_.e.direct_error(['not a directory', null]))
                        case 'directory': return p_.option($, ($) => p_super_query_result($q['read file'](
                            package_json_path,
                            ($): d.Package_Error => ['no package.json file', null],
                        )).refine(
                            ($, abort) => r_parse_npm_package(
                                $.data,
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
