import * as _p from 'pareto-core-command'
import * as _pt from 'pareto-core-transformer'
import * as _pi from 'pareto-core-interface'
import * as _pq from 'pareto-core-query'

import * as signatures from "../../../interface/signatures"

//data
import { $$ as x_structure } from "../../../data/structure"

//data types
import * as d from "../../../interface/to_be_generated/analyze_file_structure"
import * as d_directory_content from "pareto-resources/dist/interface/to_be_generated/directory_content"

//dependencies
import * as t_path_to_path from "pareto-resources/dist/implementation/manual/schemas/path/transformers/path"
import * as t_line_count_to_line_count from "../schemas/directory_content/transformers/directory_analysis"
import { $$ as q_directory_content } from "pareto-resources/dist/implementation/manual/queries/read_directory_content"

export const $$: signatures.commands.analyze_file_structure = _p.command_procedure(
    ($p, $cr, $q) => [

        _p.query(
            $q['read directory'](
                {
                    'path': t_path_to_path.create_node_path($p['path'], `packages`),
                },
                ($): d.Error => ['read directory', $],
            ),
            ($) => $,
            ($v) => [
                _p.query(
                    _pq.dictionaryx.parallel(
                        $v.map(($): _pi.Query_Result<d_directory_content.Directory, d.Package_Error> => {
                            const path = $.path
                            return _pt.cc($['node type'], ($) => {
                                switch ($[0]) {
                                    case 'other': return _pt.ss($, ($): _pi.Query_Result<d_directory_content.Directory, d.Package_Error> => _pq.direct_error<d_directory_content.Directory, d.Package_Error>(['not a directory', null]))
                                    case 'file': return _pt.ss($, ($): _pi.Query_Result<d_directory_content.Directory, d.Package_Error> => _pq.direct_error<d_directory_content.Directory, d.Package_Error>(['not a directory', null]))
                                    case 'directory': return _pt.ss($, ($): _pi.Query_Result<d_directory_content.Directory, d.Package_Error> => q_directory_content($q)(
                                        {
                                            'path': path,
                                        },
                                        ($): d.Package_Error => ['directory content', $],
                                    ))
                                    default: return _pt.au($[0])
                                }
                            })
                        }),
                        ($): d.Error => ['directory content processing', $],
                    ),
                    ($) => $,
                    ($v) => [
                        $cr.log.execute(
                            {
                                'lines': _pt.list.literal([
                                    _pt.list.literal([
                                        `package,filepath,structure path,classification,extension,unexpected,line count`,
                                    ]),

                                    $v.to_list(($, key): _pi.List<string> => {
                                        const package_name = key
                                        return t_line_count_to_line_count.dict_to_list(t_line_count_to_line_count.Directory2(t_line_count_to_line_count.defined.Directory(
                                            $,
                                            {
                                                'expected structure': x_structure,
                                                'structure path': ``
                                            }

                                        ))).map(($) => `${package_name
                                            },${$['path']
                                            },${$.analysis.structure.path
                                            },${_pt.cc($.analysis.structure.classification, ($) => {
                                                switch ($[0]) {
                                                    case 'directory': return _pt.ss($, ($) => `directory ` + _pt.cc($, ($) => {
                                                        switch ($[0]) {
                                                            case 'ignored': return _pt.ss($, ($) => `ignored`)
                                                            case 'generated': return _pt.ss($, ($) => `generated`)
                                                            case 'wildcards': return _pt.ss($, ($) => `wildcards`)
                                                            case 'dictionary': return _pt.ss($, ($) => `dictionary`)
                                                            case 'group': return _pt.ss($, ($) => `group`)
                                                            case 'freeform': return _pt.ss($, ($) => `freeform`)
                                                            default: return _pt.au($[0])
                                                        }
                                                    }))
                                                    case 'file': return _pt.ss($, ($) => `file ` + _pt.cc($, ($) => {
                                                        switch ($[0]) {
                                                            case 'generated': return _pt.ss($, ($) => `generated`)
                                                            case 'manual': return _pt.ss($, ($) => `manual`)
                                                            default: return _pt.au($[0])
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
                                    }).flatten(($) => $)
                                ]).flatten(($) => $)
                            },
                            ($): d.Error => ['log', $],
                        )
                    ]
                ),
            ]
        ),
    ]
)
