import * as _p from 'pareto-core-command'
import * as _pt from 'pareto-core-transformer'

import * as signatures from "../../../interface/signatures"


import * as d from "../../../interface/to_be_generated/tsc"

//dependencies
import * as s_path from "pareto-resources/dist/implementation/manual/schemas/path/serializers"

export const $$: signatures.commands.tsc = _p.command_procedure(

    // tsc
    ($p, $cr) => [
        $cr.tsc.execute(
            {
                'args': _pt.list.literal([
                    $p.path.transform(
                        ($) => _pt.list.literal([
                            `--project`,
                            s_path.Node_Path($),
                        ]),
                        () => _pt.list.literal([])
                    ),
                    _pt.list.literal([
                        `--pretty`,
                    ]),
                ]).flatten(($) => $),
            },
            ($) => ['error while running tsc', $],
        )
    ]
)
