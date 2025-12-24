import * as _easync from 'exupery-core-async'
import * as _ea from 'exupery-core-alg'

import * as d from "../../interface/algorithms/commands/tsc"

import { $$ as op_flatten } from "pareto-standard-operations/dist/implementation/operations/pure/list/flatten"

import * as s_path from "exupery-resources/dist/implementation/serializers/schemas/path"

export const $$: d.Procedure = _easync.create_command_procedure(

    // tsc
    ($p, $cr) => [
        $cr.tsc.execute(
            {
                'args': op_flatten(_ea.list_literal([
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
                ])),
            },
            ($) => ['error while running tsc', $],
        )
    ]
)
