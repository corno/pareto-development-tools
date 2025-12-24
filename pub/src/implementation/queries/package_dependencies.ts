import * as _easync from 'exupery-core-async'
import * as _ea from 'exupery-core-alg'
import * as _et from 'exupery-core-types'
import * as _ei from 'exupery-core-internals'

import * as d from "../../interface/algorithms/queries/package_dependencies"
import * as d_npm from "../../modules/npm/implementation/refiners/npm_package/temp"

import * as inf from "../../interface/algorithms/queries/package_dependencies"

import * as t_path_to_path from "exupery-resources/dist/implementation/transformers/schemas/path/path"
import { $$ as r_parse_npm_package } from "../../modules/npm/implementation/refiners/npm_package/temp"

export const $$: inf.Signature = _easync.create_query_function(
    ($p, $r) => $r['read directory'](
        {
            'path': t_path_to_path.create_node_path($p['path'], `packages`),
        },
        ($): d.Error => ['read directory', $],
    ).query_without_error_transformation(
        ($) => {
            return _easync.q.dictionary.parallel(
                $.map(($) => {
                    const path = $.path
                    return _ea.cc($['node type'], ($): _et.Query_Result<d_npm.NPM_Package, d.Package_Error> => {
                        switch ($[0]) {
                            case 'file': return _ea.ss($, ($): _et.Query_Result<d_npm.NPM_Package, d.Package_Error> => _easync.q.raise_error<d_npm.NPM_Package, d.Package_Error>(['not a directory', null]))
                            case 'other': return _ea.ss($, ($): _et.Query_Result<d_npm.NPM_Package, d.Package_Error> => _easync.q.raise_error<d_npm.NPM_Package, d.Package_Error>(['not a directory', null]))
                            case 'directory': return _ea.ss($, ($): _et.Query_Result<d_npm.NPM_Package, d.Package_Error> => {
                                return $r['read file'](
                                    t_path_to_path.extend_node_path(t_path_to_path.extend_node_path(path, { 'addition': `pub` }), { 'addition': `package.json` }),
                                    ($): d.Package_Error => ['no package.json file', null],
                                ).deprecated_refine_old(
                                    ($) => _ea.create_refinement_context<d_npm.NPM_Package, d_npm.NPM_Package_Parse_Error>(
                                        (abort) => r_parse_npm_package(
                                            $,
                                            abort,
                                        )
                                    ),
                                    ($): d.Package_Error => {
                                        return ['parse error', $]
                                    }
                                )

                            })
                            default: return _ea.au($[0])
                        }
                    })
                }),
                ($): d.Error => ['directory content processing', $],
            ).transform_result(
                ($): d.Result => {
                    return {
                        'packages': $,
                    }
                }
            )
        }
    )
)
