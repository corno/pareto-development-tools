import * as _easync from 'exupery-core-async'
import * as _ea from 'exupery-core-alg'

import * as d from "../../../../interface/temp/procedures/commands/tsc"

import { $$ as op_flatten } from "pareto-standard-operations/dist/implementation/algorithms/operations/pure/list/flatten"

export const $$: d.Procedure = _easync.create_command_procedure(
    ($r, $p) => $r.commands.tsc.execute.direct(
        ($) => ['error while running tsc', $],
        {
            'args': op_flatten(_ea.array_literal([
                $p.path.transform(
                    ($) => _ea.array_literal([
                        `--project`,
                        $,
                    ]),
                    () => _ea.array_literal([])
                ),
                _ea.array_literal([
                    `--pretty`,
                ]),
            ])),
        },
    )
)
