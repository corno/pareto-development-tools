import * as _easync from 'exupery-core-async'
import * as _ea from 'exupery-core-alg'

import * as d from "../../../interface/temp/procedures/commands/update_dependencies"

export const $$: d.Procedure = _easync.create_command_procedure(
    ($p, $cr) => _easync.p.sequence<d.Error>([
        $cr['update typescript dependencies'].execute(
            {
                'path': `${$p.path}/pub`,
            },
            ($) => ['error updating pub', $],
        ),
        $cr['update typescript dependencies'].execute(
            {
                'path': `${$p.path}/test`,
            },
            ($) => ['error updating test', $],
        ),
    ])
)
