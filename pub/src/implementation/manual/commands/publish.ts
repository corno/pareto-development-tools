import * as _p from 'pareto-core-command'
import * as _pt from 'pareto-core-transformer'

import * as signatures from "../../../interface/signatures"


import * as d from "../../../interface/to_be_generated/publish"

//dependencies
import * as t_path_to_path from "pareto-resources/dist/implementation/manual/schemas/path/transformers/path"

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

        $cr['build and test'].execute(
            {
                'path': $p['path to package'],
            },
            ($) => ['error while running build and test', $],
        ),

        $cr['git assert is clean'].execute(
            {
                'path': _p.optional.set($p['path to package']),
            },
            ($) => ['error while running git assert is clean after updating package dependencies', $],
        ),

        $cr.npm.execute(
            {
                'path': _p.optional.set(t_path_to_path.extend_context_path($p['path to package'], { 'addition': `pub` })),
                'operation': ['version', $p.generation],
            },
            ($) => ['error while running npm version', $],
        ),

        $cr['npm publish'].execute(
            {
                'path': _p.optional.set(t_path_to_path.extend_context_path($p['path to package'], { 'addition': `pub` })),
                'one time password': $p['one time password'],
            },
            ($) => ['error while running npm publish', $],
        ),
    ]
)
