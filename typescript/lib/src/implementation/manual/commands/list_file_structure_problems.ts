import * as pt from 'pareto-core/dist/command'
import * as _pa from 'pareto-core/dist/assign'
import * as pi from 'pareto-core/dist/interface'
import * as _pq from 'pareto-core/dist/query'

import * as signatures from "../../../interface/signatures"

//data types
import * as d from "../../../interface/to_be_generated/get_project_files"
import * as d_file_analysis from "../../../interface/to_be_generated/file_structure_analysis"

//dependencies
import * as t_project_files_to_file_analysis_list from "../transformers/project_files/directory_analysis"
import { $$ as q_get_project_files } from "../queries/get_project_files"

//shorthands
import * as sh from "pareto-fountain-pen/dist/shorthands/prose"


export const $$: signatures.commands.list_file_structure_problems = pt.command_procedure(
    ($d, $s, $q, $c) => [

        pt.query(
            q_get_project_files(null, $q)(
                {
                    'path to project': $d['path to project'],
                },
                ($): d.Error => $,

            ),
            ($, abort) => $,
            ($v) => [

                $c.log.execute(
                    {



                        'message': sh.pg.sentences(_pa.list.from.list(
                            _pa.list.from.list(
                                t_project_files_to_file_analysis_list.Project_Files($v)
                            ).map_optionally<d_file_analysis.File_Analysis2>(
                                ($) => _pa.boolean.from.optional($.analysis['unexpected path tail']).is_set()
                                    ? pt.optional.literal.set($)
                                    : pt.optional.literal.not_set()
                            )
                        ).map(
                            ($) => {
                                return sh.sentence([
                                    sh.ph.literal("./packages/"),
                                    sh.ph.literal($.package),
                                    sh.ph.literal($['path']),

                                ])
                            }
                        ))
                    },
                    ($): d.Error => ['log', $],
                )
            ]
        ),

    ]
)
