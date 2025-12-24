import * as _easync from 'exupery-core-async'
import * as _ea from 'exupery-core-alg'

import * as d from "../../interface/algorithms/commands/build"

import * as t_path_to_path from "exupery-resources/dist/implementation/transformers/path/path"
import * as t_path_to_text from "exupery-resources/dist/implementation/transformers/path/text"
import * as r_context_path from "exupery-resources/dist/implementation/refiners/context_path/text"

export const $$: d.Signature = _easync.create_command_procedure(
    ($p, $cr) => [
        $cr.remove.execute(
            {
                'path': t_path_to_path.create_node_path(r_context_path.Context_Path($p.path + `/pub`), `dist`),
                'error if not exists': false,
            },
            ($): d.Error => ['error removing pub dist dir', {'path': t_path_to_text.Node_Path($p.path), 'error': $}],
        ),
        $cr.remove.execute(
            {
                'path': t_path_to_path.create_node_path(r_context_path.Context_Path($p.path + `/test`), `dist`),
                'error if not exists': false,
            },
            ($): d.Error => ['error removing test dist dir', {'path': t_path_to_text.Node_Path($p.path), 'error': $}],
        ),
        $cr.tsc.execute(
            {
                'path': _ea.set(t_path_to_path.extend_node_path($p.path, { 'addition': `pub`})),
            },
            ($): d.Error => ['error building pub', {
                'path': t_path_to_text.Node_Path($p.path),
                'error': $,
            }],
        ),
        $cr.tsc.execute(
            {
                'path': _ea.set(t_path_to_path.extend_node_path($p.path, { 'addition': `test`})),
            },
            ($): d.Error => ['error building test', {
                'path': t_path_to_text.Node_Path($p.path),
                'error': $,
            }],
        )
    ]
)
