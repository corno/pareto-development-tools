import * as _easync from 'exupery-core-async'
import * as _ea from 'exupery-core-alg'

import * as d from "../../interface/commands/build"

export const $$: d.Signature = _easync.create_command_procedure(
    ($p, $cr) => [
        $cr.remove.execute(
            {
                'path': {
                    'path': $p.path + `/pub/dist`,
                    'escape spaces in path': true,
                },
                'error if not exists': false,
            },
            ($): d.Error => ['error removing pub dist dir', $],
        ),
        $cr.remove.execute(
            {
                'path': {
                    'path': $p.path + `/test/dist`,
                    'escape spaces in path': true,
                },
                'error if not exists': false,
            },
            ($): d.Error => ['error removing test dist dir', $],
        ),
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
    ]
)
