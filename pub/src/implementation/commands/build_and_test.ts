import * as _easync from 'exupery-core-async'
import * as _ea from 'exupery-core-alg'

import * as d from "../../interface/algorithms/commands/build_and_test"

import * as t_path_to_text from "exupery-resources/dist/implementation/transformers/path/text"

export const $$: d.Procedure = _easync.create_command_procedure(
    ($p, $cr) => [

        // build
        $cr.build.execute(
            {
                'path': $p.path,
            },
            ($): d.Error => ['error building', $],
        ),

        // test
        $cr.node.execute(
            {
                'args': _ea.list_literal([
                    t_path_to_text.Node_Path($p.path) + `/test/dist/bin/test.js`,
                    t_path_to_text.Node_Path($p.path) + `/testdata`,
                ])
            },
            ($): d.Error => ['error testing', $],
        ),
    ]
)
