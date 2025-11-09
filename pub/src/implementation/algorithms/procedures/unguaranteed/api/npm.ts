import * as _easync from 'exupery-core-async'
import * as _ei from 'exupery-core-internals'
import * as _et from 'exupery-core-types'
import * as _ed from 'exupery-core-dev'
import * as _eb from 'exupery-core-bin'
import * as _ea from 'exupery-core-alg'

import { $$ as pu_epe } from "exupery-resources/dist/implementation/algorithms/procedures/unguaranteed/execute_smelly_procedure_executable"

import { $$ as op_flatten } from "pareto-standard-operations/dist/implementation/algorithms/operations/pure/list/flatten"

import * as d_epe from "exupery-resources/dist/interface/generated/pareto/schemas/execute_smelly_procedure_executable/data_types/source"

export type Parameters = {
    'path': _et.Optional_Value<string>,
    'operation':
    | ['update', null]
    | ['install', null]
}

export type Error =
    | ['error while running tsc', d_epe.Error]
// | ['could not commit', d_eqe.Error]
// | ['could not push', d_eqe.Error]


export const $$: _easync.Unguaranteed_Procedure<Parameters, Error, null> = (
    $p,
) => {
    return _easync.__create_unguaranteed_procedure({
        'execute': (on_success, on_exception) => {
            pu_epe(
                {
                    'program': `npm`,
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
                null,
            ).__start(
                on_success,
                ($) => {
                    on_exception(['error while running tsc', $])
                },
            )
        }
    })
}