import * as _p from 'pareto-core-query'
import * as _pi from 'pareto-core-interface'

import * as signatures from "../../../interface/signatures"

//data types
import * as d from "../../../interface/to_be_generated/get_package_dependencies"
import * as d_npm from "../../../modules/npm/implementation/manual/schemas/npm_package/refiners/temp"

//dependencies
import * as t_path_to_path from "pareto-resources/dist/implementation/manual/schemas/path/transformers/path"
import { $$ as r_parse_npm_package } from "../../../modules/npm/implementation/manual/schemas/npm_package/refiners/temp"

export const $$: signatures.queries.get_package_dependencies = _p.query_function(
    ($p, $r) => $r['read directory'](
        {
            'path': t_path_to_path.create_node_path($p['path'], `packages`),
        },
        ($): d.Error => ['read directory', $],
    ).query_without_error_transformation(
        ($) => {
            return _p.dictionaryx.parallel<d_npm.NPM_Package, d.Error, d.Package_Error>(
                $.map(($) => {
                    const path = $.path
                    return _p.cc($['node type'], ($) => {
                        switch ($[0]) {
                            case 'file': return _p.ss($, ($) => _p.direct_error<d_npm.NPM_Package, d.Package_Error>(['not a directory', null]))
                            case 'other': return _p.ss($, ($) => _p.direct_error<d_npm.NPM_Package, d.Package_Error>(['not a directory', null]))
                            case 'directory': return _p.ss($, ($) => {
                                return $r['read file'](
                                    t_path_to_path.extend_node_path(t_path_to_path.extend_node_path(path, { 'addition': `pub` }), { 'addition': `package.json` }),
                                    ($): d.Package_Error => ['no package.json file', null],
                                ).refine_without_error_transformation(
                                    ($, abort) => r_parse_npm_package(
                                        $,
                                        ($) => abort(['parse error', $]),
                                    )
                                )

                            })
                            default: return _p.au($[0])
                        }
                    })
                }),
                ($): d.Error => ['directory content processing', $],
            ).transform_result(
                ($) => {
                    return {
                        'packages': $,
                    }
                }
            )
        }
    )
)
