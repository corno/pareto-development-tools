import * as _p from 'pareto-core-command'

import * as signatures from "../../../interface/signatures"

//data types
import * as d from "../../../interface/to_be_generated/build"

//dependencies
import * as t_path_to_path from "pareto-resources/dist/implementation/manual/schemas/path/transformers/path"
import * as s_path from "pareto-resources/dist/implementation/manual/schemas/path/serializers"
import * as ds_context_path from "pareto-resources/dist/implementation/manual/schemas/context_path/deserializers"

export const $$: signatures.commands.build = _p.command_procedure(
    ($p, $cr) => [
        $cr.remove.execute(
            {
                'path': t_path_to_path.create_node_path(ds_context_path.Context_Path($p.path + `/pub`), `dist`),
                'error if not exists': false,
            },
            ($): d.Error => ['error removing pub dist dir', {'path': s_path.Node_Path($p.path), 'error': $}],
        ),
        $cr.remove.execute(
            {
                'path': t_path_to_path.create_node_path(ds_context_path.Context_Path($p.path + `/test`), `dist`),
                'error if not exists': false,
            },
            ($): d.Error => ['error removing test dist dir', {'path': s_path.Node_Path($p.path), 'error': $}],
        ),
        $cr.tsc.execute(
            {
                'path': _p.optional.set(t_path_to_path.extend_node_path($p.path, { 'addition': `pub`})),
            },
            ($): d.Error => ['error building pub', {
                'path': s_path.Node_Path($p.path),
                'error': $,
            }],
        ),
        $cr.tsc.execute(
            {
                'path': _p.optional.set(t_path_to_path.extend_node_path($p.path, { 'addition': `test`})),
            },
            ($): d.Error => ['error building test', {
                'path': s_path.Node_Path($p.path),
                'error': $,
            }],
        )
    ]
)
