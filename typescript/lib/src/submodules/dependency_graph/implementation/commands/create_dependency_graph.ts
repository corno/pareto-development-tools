import * as p_ from 'pareto-core/implementation/command'
import p_super_query_result from 'pareto-core/implementation/query/super_query_result'

//interface dependencies
import type * as command_interfaces from "../../../../commands/interfaces.js"
import type * as query_interfaces from "../../../../queries/interfaces.js"
import type * as command_interfaces_pareto_stream_api from "pareto-stream-api/commands/interfaces"

//schemas
import * as d from "../../schemas/create_dependency_graph.js"

//dependencies
import * as t_package_dependencies_to_graphviz from "../transformers/package_dependencies/graphviz.js"
import * as t_graphviz_to_paragraph from "pareto-graphviz/schemas/high_level_simple/transformers/paragraph"
import * as t_paragraph_to_serialized from "pareto-fountain-pen/modules/paragraph/schemas/paragraph/transformers/serialized"

export const $$: p_.Command_Implementation<
    command_interfaces.create_dependency_graph,
    {
        'indentation': string
    },
    {
        'package dependencies': query_interfaces.get_package_dependencies
    },
    {
        'log lines': command_interfaces_pareto_stream_api.log_lines
    }
> = p_.command(
    ($d, $s, $q, $c) => [

        p_.s.query(
            p_super_query_result($q['package dependencies'](
                {
                    'path': $d['path to project'],
                },
                ($): d.Error => ['package dependencies', $],
            )).transform(
                ($) => t_package_dependencies_to_graphviz.Result($)
            ).transform(
                ($) => t_graphviz_to_paragraph.Graph($)
            ),
            ($v) => [
                $c['log lines'].execute(
                    {
                        'lines': t_paragraph_to_serialized.Paragraph(
                            $v,
                            {
                                'indentation': $s.indentation,
                            }
                        )
                    },
                    ($): d.Error => ['log', null],
                )
            ]
        ),
    ]
)
