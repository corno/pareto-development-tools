import * as _p from 'pareto-core-command'
import * as _pt from 'pareto-core-transformer'

import * as signatures from "../../../interface/signatures"

//data types
import * as d from "../../../interface/to_be_generated/clean_and_update_dependencies"

export const $$: signatures.commands.clean_and_update_dependencies = _p.command_procedure(
    ($p, $cr) =>[

        // clean
        $cr['git clean'].execute(
            {
                'path': _pt.set($p.path),
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
                'path': _pt.set($p.path),
                'operation': ['update', null], // 'install' does not update the indirect dependencies
            },
            ($) => ['could not install dependencies', $],
        ),
    ]
)