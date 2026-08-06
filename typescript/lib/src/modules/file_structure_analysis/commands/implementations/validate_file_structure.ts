import * as p_ from 'pareto-core/implementation/command'
import * as p_temp from 'pareto-core/implementation/transformer'
import * as p_s from 'pareto-core/implementation/serializer'

//interface dependencies
import type * as query_interfaces_pareto_filesystem_unrestricted_api from "pareto-filesystem-unrestricted-api/modules/unrestricted/queries/interfaces"
import type * as command_interfaces_pareto_stream_api from "pareto-stream-api/commands/interfaces"
import type * as command_interfaces from "../interfaces.js"

//schemas
import type * as s_structure from "../../schemas/structure/schema.js"
import type * as s_x from "../../schemas/get_package_files/schema.js"
import type * as s_file_analysis from "../../schemas/file_structure_analysis/schema.js"
import type * as s from "../../schemas/file_structure_validation/schema.js"

//dependencies
import * as t_package_files_to_file_analysis_list from "../../schemas/package_files/transformers/directory_analysis.js"
import { $$ as q_get_package_files } from "../../queries/implementations/get_package_files.js"


export const $$: p_.Command_Implementation<
    command_interfaces.validate_file_structure,

    {
        'structure': s_structure.Directory,
        'indentation': string
    },
    {
        'read directory': query_interfaces_pareto_filesystem_unrestricted_api.read_directory,
        'read file': query_interfaces_pareto_filesystem_unrestricted_api.read_file
    },
    {
    }
> = p_.command(
    ($d, $s, $q, $c) => [

        p_.s.query(
            q_get_package_files(null, $q)(
                {
                    'path to package': $d['path to package'],
                },
                ($): s_x.Error => $,

            ),
            ($v) => {
                const problems = p_temp.from.list(
                    t_package_files_to_file_analysis_list.Package_Files(
                        $v,
                        {
                            'structure': $s.structure
                        }
                    )
                ).filter(
                    ($) => p_temp.from.optional($.analysis['unexpected path tail']).decide(
                        () => false,
                        () => true
                    )
                )
                return [

                    p_.s.if_<s.Error>(
                        p_temp.from.list(problems).on_has_items(
                            () => true,
                            () => false,
                        ),
                        [

                            p_.s.fail(['file structure problems', p_temp.from.list(
                                problems
                            ).map(
                                ($) => p_s.ph.composed([
                                    p_s.ph.literal($['path']),
                                ])

                            )]),
                        ],
                        [
                            //nothing to do
                        ]
                    )
                ]

            }
        ),

    ]
)
