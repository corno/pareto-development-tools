import * as _easync from 'exupery-core-async'
import * as _ea from 'exupery-core-alg'

import * as d from "../../interface/commands/update_dependencies"

export const $$: d.Procedure = _easync.create_command_procedure(
    ($p, $cr) => [

        // update dependencies of pub
        $cr['clean and update dependencies'].execute(
            {
                'path': `${$p.path}/pub`,
            },
            ($): d.Error => ['error updating pub', $],
        ),

        // update dependencies of test
        $cr['clean and update dependencies'].execute(
            {
                'path': `${$p.path}/test`,
            },
            ($) => ['error updating test', $],
        ),
    ]
)
