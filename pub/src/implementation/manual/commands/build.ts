import * as _pc from 'pareto-core-command'
import * as _pt from 'pareto-core-transformer'

import * as signatures from "../../../interface/signatures"

//data types
import * as d from "../../../interface/to_be_generated/build"

//dependencies
import * as t_path_to_path from "exupery-resources/dist/implementation/transformers/schemas/path/path"
import * as s_path from "exupery-resources/dist/implementation/serializers/schemas/path"
import * as ds_context_path from "exupery-resources/dist/implementation/deserializers/schemas/context_path"

export const $$: signatures.commands.build = _pc.create_command_procedure(
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
                'path': _pt.set(t_path_to_path.extend_node_path($p.path, { 'addition': `pub`})),
            },
            ($): d.Error => ['error building pub', {
                'path': s_path.Node_Path($p.path),
                'error': $,
            }],
        ),
        $cr.tsc.execute(
            {
                'path': _pt.set(t_path_to_path.extend_node_path($p.path, { 'addition': `test`})),
            },
            ($): d.Error => ['error building test', {
                'path': s_path.Node_Path($p.path),
                'error': $,
            }],
        )
    ]
)
