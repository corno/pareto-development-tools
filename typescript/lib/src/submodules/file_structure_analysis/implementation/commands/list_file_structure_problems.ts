import * as p_ from 'pareto-core/implementation/command'
import * as p_temp from 'pareto-core/implementation/transformer'
import * as p_s from 'pareto-core/implementation/serializer'

//interface dependencies
import type * as command_interfaces from "../../../../interface/commands.js"
import type * as query_interfaces_pareto_filesystem_unrestricted_api from "pareto-filesystem-unrestricted-api/interface/queries"
import type * as command_interfaces_pareto_stream_api from "pareto-stream-api/interface/commands"

//schemas
import type * as s_structure from "../../schemas/structure.js"
import type * as s from "../../schemas/get_project_files.js"
import type * as s_file_analysis from "../../schemas/file_structure_analysis.js"

//dependencies
import * as t_project_files_to_file_analysis_list from "../transformers/project_files/directory_analysis.js"
import { $$ as q_get_project_files } from "../../../../implementation/queries/get_project_files.js"


export const $$: p_.Command_Implementation<
    command_interfaces.analyze_file_structure,
    {
        'structure': s_structure.Directory,
        'indentation': string
    },
    {
        'read directory': query_interfaces_pareto_filesystem_unrestricted_api.read_directory,
        'read file': query_interfaces_pareto_filesystem_unrestricted_api.read_file
    },
    {
        'log lines': command_interfaces_pareto_stream_api.log_lines
    }
> = p_.command(
    ($d, $s, $q, $c) => [

        p_.s.query(
            q_get_project_files(null, $q)(
                {
                    'path to project': $d['path to project'],
                },
                ($): s.Error => $,

            ),
            ($v) => [

                $c['log lines'].execute(
                    {
                        'messages': p_temp.from.list(
                            p_temp.from.list(
                                t_project_files_to_file_analysis_list.Project_Files(
                                    $v,
                                    {
                                        'structure': $s.structure
                                    }
                                )
                            ).map_optionally<s_file_analysis.File_Analysis2>(
                                ($) => {
                                    const x = $
                                    return p_temp.from.optional($.analysis['unexpected path tail']).map(
                                        ($) => x
                                    )
                                }
                            )
                        ).map(
                            ($) => p_s.ph.composed([
                                    p_s.ph.literal("./packages/"),
                                    p_s.ph.literal($.package),
                                    p_s.ph.literal($['path']),
                            ])
                            
                        ),
                    },
                    ($): s.Error => ['log', $],
                )
            ]
        ),

    ]
)
