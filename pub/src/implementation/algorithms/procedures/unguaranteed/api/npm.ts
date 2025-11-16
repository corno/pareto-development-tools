import * as _easync from 'exupery-core-async'
import * as _ei from 'exupery-core-internals'
import * as _et from 'exupery-core-types'
import * as _ed from 'exupery-core-dev'
import * as _eb from 'exupery-core-bin'
import * as _ea from 'exupery-core-alg'

import { $$ as op_flatten } from "pareto-standard-operations/dist/implementation/algorithms/operations/pure/list/flatten"

import * as d from "../../../../../interface/temp/npm"

export const $$: _et.Unguaranteed_Procedure<d.Parameters, d.Error, d.Resources> = (
    $r,
) => {
    return ($p) => $r.procedures['npm'](
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
    ).map_error(($) => ['error while running npm', $])
}