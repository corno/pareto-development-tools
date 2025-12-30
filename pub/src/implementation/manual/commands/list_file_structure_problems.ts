import * as _pc from 'pareto-core-command'
import * as _pt from 'pareto-core-transformer'
import * as _pi from 'pareto-core-interface'
import * as _pq from 'pareto-core-query'

import * as signatures from "../../../interface/signatures"

import { $$ as x_structure } from "../../../data/structure"

import * as d from "../../../interface/to_be_generated/analyze_file_structure"
import * as d_directory_content from "exupery-resources/dist/interface/to_be_generated/directory_content"

import * as t_path_to_path from "exupery-resources/dist/implementation/transformers/schemas/path/path"
import * as t_line_count_to_line_count from "../schemas/directory_content/transformers/directory_analysis"
import { $$ as q_directory_content } from "exupery-resources/dist/implementation/queries/read_directory_content"


export const $$: signatures.commands.list_file_structure_problems = _pc.create_command_procedure(
    ($p, $cr, $q) => [

        _pc.query_without_error_transformation(
            $q['read directory'](
                {
                    'path': t_path_to_path.create_node_path($p['path'], `packages`),
                },
                ($): d.Error => ['read directory', $],
            ).query_without_error_transformation(
                ($) => {
                    return _pq.dictionary.parallel(
                        $.map(($): _pi.Query_Result<d_directory_content.Directory, d.Package_Error> => {
                            const path = $.path
                            return _pt.cc($['node type'], ($) => {
                                switch ($[0]) {
                                    case 'other': return _pt.ss($, ($): _pi.Query_Result<d_directory_content.Directory, d.Package_Error> => _pq.raise_error<d_directory_content.Directory, d.Package_Error>(['not a directory', null]))
                                    case 'file': return _pt.ss($, ($): _pi.Query_Result<d_directory_content.Directory, d.Package_Error> => _pq.raise_error<d_directory_content.Directory, d.Package_Error>(['not a directory', null]))
                                    case 'directory': return _pt.ss($, ($): _pi.Query_Result<d_directory_content.Directory, d.Package_Error> => {
                                        return q_directory_content($q)(
                                            {
                                                'path': path,
                                            },
                                            ($): d.Package_Error => ['directory content', $],
                                        )
                                    })
                                    default: return _pt.au($[0])
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
                        'lines': $v.to_list(($, key) => {
                            const package_name = key
                            return t_line_count_to_line_count.dict_to_list(t_line_count_to_line_count.Directory2(t_line_count_to_line_count.defined.Directory(
                                $,
                                {
                                    'expected structure': x_structure,
                                    'structure path': ``
                                }

                            )).filter(($) => {
                                const current = $
                                return $['unexpected path tail'].map(() => $)
                            })).map(($) => `./packages/${package_name}${$['path']}`)
                        }).flatten(($) => $)
                    },
                    ($): d.Error => ['log', $],
                )
            ]
        ),
    ]
)
