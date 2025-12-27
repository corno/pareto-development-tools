import * as _easync from 'exupery-core-async'
import * as _ea from 'exupery-core-alg'

import * as signatures from "../../interface/signatures"


import * as d from "../../interface/to_be_generated/tsc"

//dependencies
import * as s_path from "exupery-resources/dist/implementation/serializers/schemas/path"

export const $$: signatures.commands.tsc = _easync.create_command_procedure(

    // tsc
    ($p, $cr) => [
        $cr.tsc.execute(
            {
                'args': _ea.list_literal([
                    $p.path.transform(
                        ($) => _ea.list_literal([
                            `--project`,
                            s_path.Node_Path($),
                        ]),
                        () => _ea.list_literal([])
                    ),
                    _ea.list_literal([
                        `--pretty`,
                    ]),
                ]).flatten(($) => $),
            },
            ($) => ['error while running tsc', $],
        )
    ]
)
