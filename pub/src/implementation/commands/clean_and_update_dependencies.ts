import * as _easync from 'exupery-core-async'
import * as _ea from 'exupery-core-alg'

import * as d from "../../interface/commands/clean_and_update_dependencies"

export const $$: d.Procedure = _easync.create_command_procedure(
    ($p, $cr) => _easync.p.sequence([
        $cr['git clean'].execute(
            {
                'path': _ea.set($p.path),
            },
            ($): d.Error => ['could not clean', $],
        ),
        $cr['update2latest'].execute(
            {
                'path': $p.path,
                'verbose': false,
                'what': ['dependencies', null],
            },
            ($) => ['could not update to latest', $],
        ),
        $cr['npm'].execute(
            {
                'path': _ea.set($p.path),
                'operation': ['update', null], // 'install' does not update the indirect dependencies
            },
            ($) => ['could not install', $],
        ),
    ])
)