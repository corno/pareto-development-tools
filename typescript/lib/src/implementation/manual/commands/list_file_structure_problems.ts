import * as p_ from 'pareto-core/dist/implementation/command'
import * as p_temp from 'pareto-core/dist/implementation/transformer'

import * as interface_ from "../../../interface/commands"

//data types
import * as d from "../../../interface/data/get_project_files"
import * as d_file_analysis from "../../../interface/data/file_structure_analysis"

//dependencies
import * as t_project_files_to_file_analysis_list from "../transformers/project_files/directory_analysis"
import * as t_to_text from "../transformers/file_structure_analysis/text"
import { $$ as q_get_project_files } from "../queries/get_project_files"

//shorthands
import * as sh from "pareto-fountain-pen/dist/shorthands/prose/deprecated"


export const $$: interface_.procedures.list_file_structure_problems = p_.command_procedure(
    ($d, $s, $q, $c) => [

        p_.s.query(
            q_get_project_files(null, $q)(
                {
                    'path to project': $d['path to project'],
                },
                ($): d.Error => $,

            ),
            ($v) => [

                $c.log.execute(
                    {
                        'message': sh.pg.sentences(
                            p_temp.from.list(
                                p_temp.from.list(
                                    t_project_files_to_file_analysis_list.Project_Files($v)
                                ).map_optionally<d_file_analysis.File_Analysis2>(
                                    ($) => {
                                        const x = $
                                        return p_temp.from.optional($.analysis['unexpected path tail']).map(
                                            ($) => x
                                        )
                                    }
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
