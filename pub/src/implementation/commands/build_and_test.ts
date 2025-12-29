import * as _pc from 'pareto-core-command'
import * as _pt from 'pareto-core-transformer'

import * as signatures from "../../interface/signatures"

//data types
import * as d from "../../interface/to_be_generated/build_and_test"

//dependencies
import * as s_path from "exupery-resources/dist/implementation/serializers/schemas/path"

export const $$: signatures.commands.build_and_test = _pc.create_command_procedure(
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
                'args': _pt.list_literal([
                    s_path.Node_Path($p.path) + `/test/dist/bin/test.js`,
                    s_path.Node_Path($p.path) + `/testdata`,
                ])
            },
            ($): d.Error => ['error testing', $],
        ),
    ]
)
