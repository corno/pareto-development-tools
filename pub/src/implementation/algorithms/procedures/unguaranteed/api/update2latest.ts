import * as _easync from 'exupery-core-async'
import * as _ei from 'exupery-core-internals'
import * as _et from 'exupery-core-types'
import * as _ed from 'exupery-core-dev'
import * as _eb from 'exupery-core-bin'
import * as _ea from 'exupery-core-alg'

import * as d from "../../../../../interface/temp/update2latest"

import { $$ as op_flatten } from "pareto-standard-operations/dist/implementation/algorithms/operations/pure/list/flatten"

export const $$: _et.Unguaranteed_Procedure<d.Parameters, d.Error, d.Resources> = (
    $r
) => {
    return ($p) => $r.procedures.update2latest(
        {
            'args': op_flatten(_ea.array_literal([
                _ea.array_literal([
                    $p.path,
                ]),
                _ea.cc($p.what, ($) => {
                    switch ($[0]) {
                        case 'dependencies': return _ea.ss($, ($) => {
                            return _ea.array_literal([`dependencies`])
                        })
                        case 'dev-dependencies': return _ea.ss($, ($) => {
                            return _ea.array_literal([`devDependencies`])
                        })
                        default: return _ea.au($[0])
                    }
                }),
                // $p.verbose ? _ea.array_literal([`verbose`]) : _ea.array_literal([]),
                _ea.array_literal([`verbose`])
            ])),
        },
    ).map_error(($) => ['error while running update2latest', $])
}