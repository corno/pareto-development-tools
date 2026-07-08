import * as p_ from 'pareto-core/implementation/command'
import p_super_query_result from 'pareto-core/implementation/query/super_query_result'

import type * as interface_ from "../../../interface/declarations/commands.js"

//data types
import * as d from "../../../interface/data/create_dependency_graph.js"

//dependencies
import * as t_package_dependencies_to_graphviz from "../transformers/package_dependencies/graphviz.js"
import * as t_graphviz_to_prose from "pareto-graphviz/implementation/manual/transformers/high_level_simple/prose"

export const $$: interface_.create_dependency_graph = p_.command(
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
                ($) => t_graphviz_to_prose.Graph($)
            ),
            ($v) => [
                $c['log'].execute(
                    {
                        'message': $v
                    },
                    ($): d.Error => ['log', null],
                )
            ]
        ),
    ]
)
