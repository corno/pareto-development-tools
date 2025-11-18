import * as _easync from 'exupery-core-async'
import * as _ea from 'exupery-core-alg'

import * as d from "../../../interface/temp/procedures/commands/build"

export const $$: d.Procedure = _easync.create_command_procedure(
    ($p, $cr) => _easync.p.sequence([
        $cr.tsc.execute(
            {
                'path': _ea.set($p.path + `/pub`),
            },
            ($): d.Error => ['error building pub', $],
        ),
        $cr.tsc.execute(
            {
                'path': _ea.set($p.path + `/test`),
            },
            ($): d.Error => ['error building test', $],
        )
    ])
)
