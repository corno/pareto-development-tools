import * as _easync from 'exupery-core-async'
import * as _ea from 'exupery-core-alg'

import * as d from "../../../interface/temp/procedures/commands/clean_and_update_dependencies"

export const $$: d.Procedure = _easync.create_command_procedure(
    ($r, $p) => _easync.p.sequence([
        $r.commands['git clean'].execute.direct(
            ($): d.Error => ['could not clean', $],
            {
                'path': _ea.set($p.path),
            },
        ),
        $r.commands['update2latest'].execute.direct(
            ($) => ['could not update to latest', $],
            {
                'path': $p.path,
                'verbose': false,
                'what': ['dependencies', null],
            },
        ),
        $r.commands['npm'].execute.direct(
            ($) => ['could not install', $],
            {
                'path': _ea.set($p.path),
                'operation': ['update', null], // 'install' does not update the indirect dependencies
            },
        ),
    ])
)