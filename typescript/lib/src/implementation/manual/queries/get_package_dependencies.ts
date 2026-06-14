import * as _p from 'pareto-core/dist/query'
import * as _pqi from 'pareto-core/dist/query_interface'


import * as signatures from "../../../interface/signatures"

//data types
import * as d from "../../../interface/to_be_generated/get_package_dependencies"
import * as d_npm_package from "../../../modules/npm/interface/to_be_generated/npm_package"

//dependencies
import * as t_path_to_path from "pareto-resources/dist/implementation/manual/transformers/unrestricted_path/unrestricted_path"
import * as t_path_to_text from "pareto-resources/dist/implementation/manual/transformers/unrestricted_path/text"
import { $$ as r_parse_npm_package } from "../../../modules/npm/implementation/manual/transformers/npm_package/text"

export const $$: signatures.queries.get_package_dependencies = _p.query_function(
    ($d, $s, $q) => $q['read directory'](
        {
            'path': t_path_to_path.extend_context_path_with_single_step($d['path'], { 'addition': "packages" }),
        },
        ($): d.Error => ['read directory', $],
    ).query(
        ($) => _p.dictionaryx.parallel(
            $,
            ($): _pqi.Query_Result<d_npm_package.NPM_Package, d.Package_Error> => {
                const lib_path = t_path_to_path.extend_context_path_with_list(
                    t_path_to_path.deprecated_node_path_to_context_path($.path),
                    {
                        'addition': _p.list.literal(["typescript", "lib"])
                    }
                )
                const package_json_path = t_path_to_path.create_node_path(lib_path, { 'node': "package.json" })
                return _p.decide.state($['node type'], ($) => {
                    switch ($[0]) {
                        case 'file': return _p.ss($, ($) => _p.direct_error<d_npm_package.NPM_Package, d.Package_Error>(['not a directory', null]))
                        case 'other': return _p.ss($, ($) => _p.direct_error<d_npm_package.NPM_Package, d.Package_Error>(['not a directory', null]))
                        case 'directory': return _p.ss($, ($) => $q['read file'](
                            package_json_path,
                            ($): d.Package_Error => ['no package.json file', null],
                        ).refine(
                            ($, abort) => r_parse_npm_package(
                                $,
                                ($) => abort(['parse error', {
                                    'type': $,
                                    'path': package_json_path,
                                }]),
                            )
                        ))
                        default: return _p.au($[0])
                    }
                })
            },
            ($): d.Error => ['directory content processing', $],
        ).transform(
            ($) => ({
                'packages': $,
            })
        )
    )
)
