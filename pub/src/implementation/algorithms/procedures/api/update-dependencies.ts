import * as _easync from 'exupery-core-async'
import * as _ea from 'exupery-core-alg'

import * as d from "../../../../interface/temp/procedures/commands/update_dependencies"

export const $$: d.Procedure = _easync.create_command_procedure(
    ($r, $p) => _easync.p.sequence([
        $r.commands['update typescript dependencies'].execute.direct(
            ($): d.Error => ['error updating pub', $],
            {
                'path': `${$p.path}/pub`,
            },
        ),
        $r.commands['update typescript dependencies'].execute.direct(
            ($) => ['error updating test', $],
            {
                'path': `${$p.path}/test`,
            },
        ),
    ])
)
