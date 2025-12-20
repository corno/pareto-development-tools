import * as _easync from 'exupery-core-async'
import * as _ea from 'exupery-core-alg'
import * as _et from 'exupery-core-types'

import { $$ as x_structure } from "../../data/structure"

import * as d from "../../interface/algorithms/commands/line_count"
import * as d_directory_content from "exupery-resources/dist/interface/algorithms/queries/directory_content"

import * as t_path_to_path from "exupery-resources/dist/implementation/transformers/path/path"
import * as t_line_count_to_line_count from "../transformers/directory_content/directory_analysis"
import { $$ as q_directory_content } from "exupery-resources/dist/implementation/queries/directory_content"

import { $$ as op_flatten_list } from "pareto-standard-operations/dist/implementation/algorithms/operations/pure/list/flatten"

import * as sh from "pareto-fountain-pen/dist/shorthands/block"

export const $$: d.Signature = _easync.create_command_procedure(
    ($p, $cr, $q) => [

        _easync.p.query_without_error_transformation(
            $q['read directory'](
                {
                    'path': t_path_to_path.create_node_path($p['path'], `packages`),
                },
                ($): d.Error => ['read directory', $],
            ).query_without_error_transformation(
                ($) => {
                    return _easync.q.dictionary.parallel(
                        $.map(($): _et.Query_Result<d_directory_content.Directory, d.Package_Error> => {
                            const path = $.path
                            return _ea.cc($['node type'], ($) => {
                                switch ($[0]) {
                                    case 'other': return _ea.ss($, ($): _et.Query_Result<d_directory_content.Directory, d.Package_Error> => _easync.q.raise_error<d_directory_content.Directory, d.Package_Error>(['not a directory', null]))
                                    case 'file': return _ea.ss($, ($): _et.Query_Result<d_directory_content.Directory, d.Package_Error> => _easync.q.raise_error<d_directory_content.Directory, d.Package_Error>(['not a directory', null]))
                                    case 'directory': return _ea.ss($, ($): _et.Query_Result<d_directory_content.Directory, d.Package_Error> => {
                                        return q_directory_content($q)(
                                            {
                                                'path': path,
                                            },
                                            ($): d.Package_Error => ['directory content', $],
                                        )
                                    })
                                    default: return _ea.au($[0])
                                }
                            })
                        }),
                        ($): d.Error => ['directory content processing', $],
                    )
                }
            ),
            ($v) => [
                $cr.log.execute(
                    {
                        'lines': op_flatten_list(_ea.list_literal([
                            _ea.list_literal([
                                `package,filepath,structure path,classification,extension,unexpected,line count`,
                            ]),
                            op_flatten_list<string>(
                                $v.deprecated_to_array(() => 1).map(($): _et.List<string> => {
                                    const package_name = $.key
                                    return t_line_count_to_line_count.dict_to_list(t_line_count_to_line_count.Directory2(t_line_count_to_line_count.defined.Directory(
                                        $.value,
                                        {
                                            'expected structure': x_structure,
                                            'structure path': ``
                                        }

                                    ))).map(($) => `${package_name
                                        },${$['path']
                                        },${$.analysis.structure.path
                                        },${_ea.cc($.analysis.structure.classification, ($) => {
                                            switch ($[0]) {
                                                case 'directory': return _ea.ss($, ($) => `directory ` + _ea.cc($, ($) => {
                                                    switch ($[0]) {
                                                        case 'ignored': return _ea.ss($, ($) => `ignored`)
                                                        case 'generated': return _ea.ss($, ($) => `generated`)
                                                        case 'wildcards': return _ea.ss($, ($) => `wildcards`)
                                                        case 'dictionary': return _ea.ss($, ($) => `dictionary`)
                                                        case 'group': return _ea.ss($, ($) => `group`)
                                                        case 'freeform': return _ea.ss($, ($) => `freeform`)
                                                        default: return _ea.au($[0])
                                                    }
                                                }))
                                                case 'file': return _ea.ss($, ($) => `file ` + _ea.cc($, ($) => {
                                                    switch ($[0]) {
                                                        case 'generated':  return _ea.ss($, ($) => `generated`)
                                                        case 'manual': return _ea.ss($, ($) => `manual`)
                                                        default: return _ea.au($[0])
                                                    }
                                                }))
                                            }
                                        })
                                        },${$.analysis.extension.transform(($) => $, () => ``)
                                        },${$.analysis['unexpected path tail'].transform(
                                            ($) => $,
                                            () => ``
                                        )
                                        },${$.analysis['line count']
                                        }`)
                                })
                            )
                        ]))
                    },
                    ($): d.Error => ['log', $],
                )
            ]
        ),
    ]
)
