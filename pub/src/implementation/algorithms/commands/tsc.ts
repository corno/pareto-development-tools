import * as _easync from 'exupery-core-async'
import * as _ea from 'exupery-core-alg'

import * as d from "../../../interface/temp/procedures/commands/tsc"

import { $$ as op_flatten } from "pareto-standard-operations/dist/implementation/algorithms/operations/pure/list/flatten"

export const $$: d.Procedure = _easync.create_command_procedure(
    ($p, $cr) => $cr.tsc.execute(
        {
            'args': op_flatten(_ea.list_literal([
                $p.path.transform(
                    ($) => _ea.list_literal([
                        `--project`,
                        $,
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
)
