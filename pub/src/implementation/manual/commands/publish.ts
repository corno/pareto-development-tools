import * as _p from 'pareto-core-command'
import * as _pt from 'pareto-core-transformer'

import * as signatures from "../../../interface/signatures"


import * as d from "../../../interface/to_be_generated/tsc"

//dependencies
import * as s_path from "pareto-resources/dist/implementation/manual/schemas/path/serializers"

export const $$: signatures.commands.publish = _p.command_procedure(

    // tsc
    ($p, $cr) => [
        $cr['git push'].execute(
            {
                'path': _p.optional.set($p['path to package']),
            },
            ($) => ['error while running git push', $],
        )
    ]
)
