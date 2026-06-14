import * as p_ from 'pareto-core/dist/command/implementation'
import * as p_t from 'pareto-core/dist/assign'

import * as signatures from "../../../interface/commands"

//data types
import * as d from "../../../interface/to_be_generated/create_dependency_graph"

//dependencies
// import { $$ as c_fp_log } from "pareto-fountain-pen-file-structure/dist/implementation/manual/commands/console_log"
import * as t_package_dependencies_to_graphviz from "../transformers/package_dependencies/graphviz"
import * as t_graphviz_to_fountain_pen from "pareto-graphviz/dist/implementation/manual/transformers/high_level_simple/fountain_pen"

export const $$: signatures.procedures.create_dependency_graph = p_.command_procedure(
    ($d, $s, $q, $c) => [

        p_.query(
            $q['package dependencies'](
                {
                    'path': $d['path to project'],
                },
                ($): d.Error => ['package dependencies', $],
            ).transform(
                ($) => t_package_dependencies_to_graphviz.Result($)
            ).transform(
                ($) => t_graphviz_to_fountain_pen.Graph($)
            ),
            ($) => $,
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
