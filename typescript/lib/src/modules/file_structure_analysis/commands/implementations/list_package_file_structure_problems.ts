import * as p_ from 'pareto-core/implementation/command'
import * as p_temp from 'pareto-core/implementation/transformer'
import * as p_s from 'pareto-core/implementation/serializer'
import * as p_schema from 'pareto-core/interface/schema'

//interface dependencies
import type * as query_interfaces_pareto_filesystem_unrestricted_api from "pareto-filesystem-unrestricted-api/modules/unrestricted/queries/interfaces"
import type * as command_interfaces_pareto_stream_api from "pareto-stream-api/commands/interfaces"
import type * as command_interfaces from "../interfaces.js"

//schemas
import type * as s_structure from "../../schemas/structure/schema.js"
import type * as s from "../../schemas/list_package_file_structure_problems/schema.js"

//dependencies
import * as r_analysis_from_package_files from "../../schemas/package_file_analysis/refiners/package_files.js"
import { $$ as q_directory_content } from "pareto-filesystem-unrestricted-api/modules/helpers/queries/implementations/read_nested_directory_content"


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
            q_directory_content(null, $q)(
                {
                    'path': $d['path to package'],
                },
                ($): s.Error => ['directory content processing', $],

            ),
            ($v) => [

                $c['log lines'].execute(
                    {
                        'lines': p_temp.from.list(
                            p_temp.from.dictionary(
                                r_analysis_from_package_files.Analyzed_Package_Nodes(
                                    $v,
                                    {
                                        'structure': $s.structure
                                    }
                                ),
                            ).convert_to_list(
                                ($, id) => ({
                                    'path': id,
                                    'analysis': $,
                                })
                            )
                        ).map_optionally(
                            ($) => {
                                const path = $.path
                                return p_temp.from.state($.analysis).decide(
                                    ($): p_schema.Optional_Value<string> => {
                                        switch ($[0]) {
                                            case 'file': return p_temp.option($, ($) => p_temp.from.optional($['unexpected path tail']).map(
                                                ($) => p_s.ph.literal(path)
                                            ))
                                            case 'other': return p_temp.option($, ($) => p_temp.literal.set(p_s.ph.literal(path)))
                                            case 'unexpected directory':  return p_temp.option($, ($) => p_temp.literal.set(p_s.ph.literal(path)))
                                            default: return p_temp.exhaustive($[0])
                                        }
                                    }
                                )
                            }
                        ),
                    },
                    ($): s.Error => ['log', $],
                )
            ]
        ),

    ]
)
