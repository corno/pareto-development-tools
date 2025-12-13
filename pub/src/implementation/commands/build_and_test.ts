import * as _easync from 'exupery-core-async'
import * as _ea from 'exupery-core-alg'

import * as d from "../../interface/commands/build_and_test"

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
                    $p.path + `/test/dist/bin/test.js`,
                    $p.path + `/testdata`,
                ])
            },
            ($): d.Error => ['error testing', $],
        ),
    ]
)
