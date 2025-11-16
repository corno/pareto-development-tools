import * as _easync from 'exupery-core-async'
import * as _ea from 'exupery-core-alg'

import * as d from "../../../../interface/temp/procedures/commands/build_and_test"

export const $$: d.Procedure = _easync.create_command_procedure(
    ($r, $p) => _easync.p.sequence([
        $r.commands.build.execute.direct(
            ($): d.Error => ['error building', $],
            {
                'path': $p.path,
            },
        ),
        $r.commands.node.execute.direct(
            ($): d.Error => ['error testing', $],
            {
                'args': _ea.array_literal([
                    $p.path + `/test/dist/bin/test.js`,
                ])
            },
        ),
    ])
)
