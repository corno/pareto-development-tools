import * as _p from 'pareto-core/dist/command'
import * as _pt from 'pareto-core/dist/transformer'

import * as signatures from "../../../interface/signatures"

//data types
import * as d from "../../../interface/to_be_generated/build_and_test"

//dependencies
import * as s_path from "pareto-resources/dist/implementation/manual/schemas/path/serializers"

export const $$: signatures.commands.build_and_test = _p.command_procedure(
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
                'args': _pt.list.literal([
                    s_path.Context_Path($p.path) + `/test/dist/bin/test.js`,
                    s_path.Context_Path($p.path) + `/testdata`,
                ])
            },
            ($): d.Error => ['error testing', $],
        ),
    ]
)
