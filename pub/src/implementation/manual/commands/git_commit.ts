import * as _p from 'pareto-core/dist/command'
import * as _pt from 'pareto-core/dist/transformer'

import * as signatures from "../../../interface/signatures"


import * as d from "../../../interface/to_be_generated/git_commit"

export const $$: signatures.commands.git_commit = _p.command_procedure(

    ($p, $cr) => [



        $cr['build and test'].execute(
            {
                'path': $p['path'],
            },
            ($): d.Error => ['error while running build and test', $],
        ),

        $cr['git extended commit'].execute(
            {
                'path': _p.optional.set($p['path']),
                'instruction': $p['instruction'],
            },
            ($): d.Error => ['git extended commit', $],
        )

    ]
)
