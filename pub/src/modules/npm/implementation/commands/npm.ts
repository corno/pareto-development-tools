import * as _easync from 'exupery-core-async'
import * as _ea from 'exupery-core-alg'

import * as d from "../../interface/npm"

import { $$ as op_flatten } from "pareto-standard-operations/dist/implementation/algorithms/operations/pure/list/flatten"

export const $$: d.Procedure = _easync.create_command_procedure(
    ($p, $cr) => $cr['npm'].execute(
        {
            'args': op_flatten(_ea.list_literal([
                $p.path.transform(
                    ($) => _ea.list_literal([
                        `--prefix`,
                        $,
                    ]),
                    () => _ea.list_literal([])
                ),
                _ea.cc($p.operation, ($) => {
                    switch ($[0]) {
                        case 'update': return _ea.ss($, ($) => {
                            return _ea.list_literal([
                                `update`,
                            ])
                        })
                        case 'install': return _ea.ss($, ($) => {
                            return _ea.list_literal([
                                `install`,
                            ])
                        })
                        default: return _ea.au($[0])
                    }
                })
            ])),
        },
        ($) => ['error while running npm', $],
    )
)