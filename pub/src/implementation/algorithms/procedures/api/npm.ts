import * as _easync from 'exupery-core-async'
import * as _ea from 'exupery-core-alg'

import * as d from "../../../../interface/temp/procedures/commands/npm"

import { $$ as op_flatten } from "pareto-standard-operations/dist/implementation/algorithms/operations/pure/list/flatten"

export const $$: d.Procedure = _easync.create_command_procedure(
    ($r, $p) => $r.commands['npm'].execute.direct(
        ($) => ['error while running npm', $],
        {
            'args': op_flatten(_ea.array_literal([
                $p.path.transform(
                    ($) => _ea.array_literal([
                        `--prefix`,
                        $,
                    ]),
                    () => _ea.array_literal([])
                ),
                _ea.cc($p.operation, ($) => {
                    switch ($[0]) {
                        case 'update': return _ea.ss($, ($) => {
                            return _ea.array_literal([
                                `update`,
                            ])
                        })
                        case 'install': return _ea.ss($, ($) => {
                            return _ea.array_literal([
                                `install`,
                            ])
                        })
                        default: return _ea.au($[0])
                    }
                })
            ])),
        },
    )
)