import * as _pc from 'pareto-core-command'
import * as _pt from 'pareto-core-transformer'

import * as signatures from "../../interface/signatures"

//data types
import * as d from "../../interface/to_be_generated/create_dependency_graph"

//dependencies
import * as t_package_dependencies_to_graphviz from "../transformers/schemas/package_dependencies/graphviz"
import * as t_graphviz_to_fountain_pen from "pareto-graphviz/dist/implementation/transformers/schemas/graphviz/fountain_pen"

export const $$: signatures.commands.create_dependency_graph = _pc.create_command_procedure(
    ($p, $cr, $q) => [

        _pc.query_without_error_transformation(
            $q['package dependencies'](
                {
                    'path': $p.path,
                },
                ($): d.Error => ['package dependencies', $],
            ).transform_result(
                ($) => t_package_dependencies_to_graphviz.Result($)
            ).transform_result(
                ($) => t_graphviz_to_fountain_pen.Graph($)
            ),
            ($v) => [
                $cr.log.execute(
                    {
                        'indentation': `    `,
                        'group': $v,
                    },
                    ($): d.Error => ['log', null],
                )

            ]
        ),
    ]
)
