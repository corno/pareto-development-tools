import * as _p from 'pareto-core-command'
import * as _pt from 'pareto-core-transformer'

import * as signatures from "../../../interface/signatures"


import * as d from "../../../interface/to_be_generated/publish"

//dependencies
import * as s_path from "pareto-resources/dist/implementation/manual/schemas/path/serializers"

export const $$: signatures.commands.publish = _p.command_procedure(

    ($p, $cr) => [

        $cr['git push'].execute(
            {
                'path': _p.optional.set($p['path to package']),
            },
            ($): d.Error => ['error while running git push', $],
        ),

        $cr['git assert is clean'].execute(
            {
                'path': _p.optional.set($p['path to package']),
            },
            ($) => ['error while running git assert is clean at the start', $],
        ),

        $cr['git make pristine'].execute(
            {
                'path': _p.optional.set($p['path to package']),
            },
            ($) => ['error while running git make pristine', $],
        ),

        $cr['update package dependencies'].execute(
            {
                'path': $p['path to package'],
            },
            ($) => ['error while running update package dependencies', $],
        ),

        $cr['git assert is clean'].execute(
            {
                'path': _p.optional.set($p['path to package']),
            },
            ($) => ['error while running git assert is clean after updating package dependencies', $],
        ),
    ]
)
