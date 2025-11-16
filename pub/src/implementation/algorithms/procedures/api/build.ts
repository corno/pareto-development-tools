import * as _easync from 'exupery-core-async'
import * as _ea from 'exupery-core-alg'

import * as d from "../../../../interface/temp/procedures/commands/build"

export const $$: d.Procedure = _easync.create_command_procedure(
    ($r, $p) => _easync.p.sequence([
        $r.commands.tsc.execute.direct(
            ($): d.Error => ['error building pub', $],
            {
                'path': _ea.set($p.path + `/pub`),
            },
        ),
        $r.commands.tsc.execute.direct(
            ($): d.Error => ['error building test', $],
            {
                'path': _ea.set($p.path + `/test`),
            },
        )
    ])
)
