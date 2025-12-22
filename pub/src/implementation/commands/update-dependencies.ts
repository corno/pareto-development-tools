import * as _easync from 'exupery-core-async'
import * as _ea from 'exupery-core-alg'

import * as d from "../../interface/algorithms/commands/update_dependencies"

import * as t_path_to_path from "exupery-resources/dist/implementation/transformers/path/path"

export const $$: d.Procedure = _easync.create_command_procedure(
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
