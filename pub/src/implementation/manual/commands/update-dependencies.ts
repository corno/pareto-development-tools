import * as _p from 'pareto-core-command'
import * as _pt from 'pareto-core-transformer'

import * as signatures from "../../../interface/signatures"

//data types
import * as d from "../../../interface/to_be_generated/update_dependencies"

//dependencies
import * as t_path_to_path from "pareto-resources/dist/implementation/manual/schemas/path/transformers/path"

export const $$: signatures.commands.update_dependencies = _p.command_procedure(
    ($p, $cr) => [

        // update dependencies of pub
        $cr['clean and update dependencies'].execute(
            {
                'path': t_path_to_path.extend_node_path($p.path, { 'addition': `pub`}),
            },
            ($): d.Error => ['error updating pub', $],
        ),

        // update dependencies of test
        $cr['clean and update dependencies'].execute(
            {
                'path': t_path_to_path.extend_node_path($p.path, { 'addition': `test`}),
            },
            ($) => ['error updating test', $],
        ),
    ]
)
