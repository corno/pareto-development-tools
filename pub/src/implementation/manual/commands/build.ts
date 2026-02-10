import * as _p from 'pareto-core/dist/command'

import * as signatures from "../../../interface/signatures"

//data types
import * as d from "../../../interface/to_be_generated/build"

//dependencies
import * as t_path_to_path from "pareto-resources/dist/implementation/manual/transformers/path/path"

export const $$: signatures.commands.build = _p.command_procedure(
    ($p, $cr) => [
        // $cr.remove.execute(
        //     {
        //         'path': t_path_to_path.create_node_path(
        //             t_path_to_path.extend_context_path(
        //                 $p.path,
        //                 {
        //                     'addition': "pub"
        //                 }
        //             ),
        //             "dist"
        //         ),
        //         'error if not exists': false,
        //     },
        //     ($): d.Error => ['error removing pub dist dir', { 'path': $p.path, 'error': $ }],
        // ),
        $cr.tsc.execute(
            {
                'path': _p.optional.literal.set(t_path_to_path.create_node_path($p.path, { 'node': "pub" })),
            },
            ($): d.Error => ['error building pub', {
                'path': $p.path,
                'error': $,
            }],
        ),
        $cr.remove.execute(
            {
                'path': t_path_to_path.create_node_path(
                    t_path_to_path.extend_context_path(
                        $p.path,
                        {
                            'addition': "test"
                        }
                    ),
                    { 'node': "dist" }
                ),
                'error if not exists': false,
            },
            ($): d.Error => ['error removing test dist dir', { 'path': $p.path, 'error': $ }],
        ),
        $cr.tsc.execute(
            {
                'path': _p.optional.literal.set(t_path_to_path.create_node_path($p.path, { 'node': "test" })),
            },
            ($): d.Error => ['error building test', {
                'path': $p.path,
                'error': $,
            }],
        )
    ]
)
