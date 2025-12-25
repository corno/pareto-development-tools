import * as _easync from 'exupery-core-async'
import * as _ea from 'exupery-core-alg'

import * as signatures from "../../interface/signatures"

//data types
import * as d from "../../interface/to_be_generated/build_and_test"

//dependencies
import * as s_path from "exupery-resources/dist/implementation/serializers/schemas/path"

export const $$: signatures.commands.build_and_test = _easync.create_command_procedure(
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
                    s_path.Node_Path($p.path) + `/test/dist/bin/test.js`,
                    s_path.Node_Path($p.path) + `/testdata`,
                ])
            },
            ($): d.Error => ['error testing', $],
        ),
    ]
)
