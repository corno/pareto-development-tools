import * as p_ from 'pareto-core/dist/implementation/command'
import p_super_query_result from 'pareto-core/dist/implementation/query/super_query_result'

import * as interface_ from "../../../interface/commands"

//data types
import * as d from "../../../interface/data/create_dependency_graph"

//dependencies
// import { $$ as c_fp_log } from "pareto-fountain-pen-file-structure/dist/implementation/manual/commands/console_log"
import * as t_package_dependencies_to_graphviz from "../transformers/package_dependencies/graphviz"
import * as t_graphviz_to_prose from "pareto-graphviz/dist/implementation/manual/transformers/high_level_simple/fountain_pen"

export const $$: interface_.procedures.create_dependency_graph = p_.command_procedure(
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
