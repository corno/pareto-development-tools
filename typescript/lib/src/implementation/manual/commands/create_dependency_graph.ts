import * as _p from 'pareto-core/dist/command'
import * as _pt from 'pareto-core/dist/assign'

import * as signatures from "../../../interface/signatures"

//data types
import * as d from "../../../interface/to_be_generated/create_dependency_graph"

//dependencies
import { $$ as c_fp_log } from "pareto-fountain-pen-file-structure/dist/implementation/manual/commands/console_log"
import * as t_package_dependencies_to_graphviz from "../transformers/package_dependencies/graphviz"
import * as t_graphviz_to_fountain_pen from "pareto-graphviz/dist/implementation/manual/transformers/high_level_simple/fountain_pen"

export const $$: signatures.commands.create_dependency_graph = _p.command_procedure(
    ($p, $cr, $q) => [

        _p.query(
            $q['package dependencies'](
                {
                    'path': $p['path to project'],
                },
                ($): d.Error => ['package dependencies', $],
            ).transform_result(
                ($) => t_package_dependencies_to_graphviz.Result($)
            ).transform_result(
                ($) => t_graphviz_to_fountain_pen.Graph($)
            ),
            ($) => $,
            ($v) => [
                c_fp_log(
                    {
                        'log': $cr.log,
                    },
                    null,
                ).execute(
                    {
                        'indentation': "    ",
                        'paragraph': $v,
                    },
                    ($): d.Error => ['log', null],
                )

            ]
        ),
    ]
)
