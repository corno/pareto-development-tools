import * as p_ from 'pareto-core/implementation/command'
import * as p_temp from 'pareto-core/implementation/transformer'
import * as p_s from 'pareto-core/implementation/serializer'

//interface dependencies
import type * as query_interfaces_pareto_filesystem_unrestricted_api from "pareto-filesystem-unrestricted-api/modules/unrestricted/queries/interfaces"
import type * as command_interfaces_pareto_stream_api from "pareto-stream-api/commands/interfaces"
import type * as command_interfaces from "../interfaces.js"

//schemas
import type * as s_structure from "../../schemas/structure/schema.js"
import type * as s from "../../schemas/get_package_files/schema.js"
import type * as s_file_analysis from "../../schemas/file_structure_analysis/schema.js"
import type * as s_get_package_files from "../../schemas/get_package_files/schema.js"

//dependencies
import * as t_package_files_to_file_analysis_list from "../../schemas/package_files/transformers/directory_analysis.js"
import { $$ as q_get_package_files } from "../../queries/implementations/get_package_files.js"


export const $$: p_.Command_Implementation<
    command_interfaces.list_package_file_structure_problems,

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
            q_get_package_files(null, $q)(
                {
                    'path to package': $d['path to package'],
                },
                ($): s.Error => $,

            ),
            ($v) => [

                $c['log lines'].execute(
                    {
                        'lines': p_temp.from.list(
                            p_temp.from.list(
                                t_package_files_to_file_analysis_list.Package_Files(
                                    $v,
                                    {
                                        'structure': $s.structure
                                    }
                                )
                            ).map_optionally<s_file_analysis.Package_File_Analysis>(
                                ($) => {
                                    const x = $
                                    return p_temp.from.optional($.analysis['unexpected path tail']).map(
                                        ($) => x
                                    )
                                }
                            )
                        ).map(
                            ($) => p_s.ph.composed([
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
