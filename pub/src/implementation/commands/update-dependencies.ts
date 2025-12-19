import * as _easync from 'exupery-core-async'
import * as _ea from 'exupery-core-alg'

import * as d from "../../interface/algorithms/commands/update_dependencies"

import * as t_path_to_path from "exupery-resources/dist/implementation/transformers/path/path"

export const $$: d.Procedure = _easync.create_command_procedure(
    ($p, $cr) => [

        // update dependencies of pub
        $cr['clean and update dependencies'].execute(
            {
                'path': t_path_to_path.create_node_path(t_path_to_path.node_path_to_context_path($p.path), `pub`),
            },
            ($): d.Error => ['error updating pub', $],
        ),

        // update dependencies of test
        $cr['clean and update dependencies'].execute(
            {
                'path': t_path_to_path.create_node_path(t_path_to_path.node_path_to_context_path($p.path), `test`),
            },
            ($) => ['error updating test', $],
        ),
    ]
)
