import * as _pq from 'pareto-core-query'
import * as _pt from 'pareto-core-transformer'
import * as _pi from 'pareto-core-interface'
import * as _pinternals from 'pareto-core-internals'

import * as signatures from "../../interface/signatures"

//data types
import * as d from "../../interface/to_be_generated/get_package_dependencies"
import * as d_npm from "../../modules/npm/implementation/refiners/schemas/npm_package/temp"

//dependencies
import * as t_path_to_path from "exupery-resources/dist/implementation/transformers/schemas/path/path"
import { $$ as r_parse_npm_package } from "../../modules/npm/implementation/refiners/schemas/npm_package/temp"

export const $$: signatures.queries.get_package_dependencies = _pq.create_query_function(
    ($p, $r) => $r['read directory'](
        {
            'path': t_path_to_path.create_node_path($p['path'], `packages`),
        },
        ($): d.Error => ['read directory', $],
    ).query_without_error_transformation(
        ($) => {
            return _pq.dictionary.parallel(
                $.map(($) => {
                    const path = $.path
                    return _pt.cc($['node type'], ($): _pi.Query_Result<d_npm.NPM_Package, d.Package_Error> => {
                        switch ($[0]) {
                            case 'file': return _pt.ss($, ($) => _pq.raise_error(['not a directory', null]))
                            case 'other': return _pt.ss($, ($) => _pq.raise_error(['not a directory', null]))
                            case 'directory': return _pt.ss($, ($) => {
                                return $r['read file'](
                                    t_path_to_path.extend_node_path(t_path_to_path.extend_node_path(path, { 'addition': `pub` }), { 'addition': `package.json` }),
                                    ($): d.Package_Error => ['no package.json file', null],
                                ).deprecated_refine_old(
                                    ($) => _pinternals.deprecated_create_refinement_context<d_npm.NPM_Package, d_npm.NPM_Package_Parse_Error>(
                                        (abort) => r_parse_npm_package(
                                            $,
                                            abort,
                                        )
                                    ),
                                    ($) => {
                                        return ['parse error', $]
                                    }
                                )

                            })
                            default: return _pt.au($[0])
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
