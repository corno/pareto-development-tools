import * as _easync from 'exupery-core-async'
import * as _ea from 'exupery-core-alg'

import * as d from "../../interface/commands/clean_and_update_dependencies"

export const $$: d.Procedure = _easync.create_command_procedure(
    ($p, $cr) =>[

        // clean
        $cr['git clean'].execute(
            {
                'path': _ea.set($p.path),
            },
            ($): d.Error => ['could not clean', $],
        ),

        // update dependencies
        $cr['update2latest'].execute(
            {
                'path': $p.path,
                'verbose': false,
                'what': ['dependencies', null],
            },
            ($) => ['could not update to latest', $],
        ),

        // install/update updated dependencies
        $cr['npm'].execute(
            {
                'path': _ea.set($p.path),
                'operation': ['update', null], // 'install' does not update the indirect dependencies
            },
            ($) => ['could not install dependencies', $],
        ),
    ]
)