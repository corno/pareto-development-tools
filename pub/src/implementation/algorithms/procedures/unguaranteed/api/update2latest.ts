import * as _easync from 'exupery-core-async'
import * as _ei from 'exupery-core-internals'
import * as _et from 'exupery-core-types'
import * as _ed from 'exupery-core-dev'
import * as _eb from 'exupery-core-bin'
import * as _ea from 'exupery-core-alg'

import { $$ as op_flatten } from "pareto-standard-operations/dist/implementation/algorithms/operations/pure/list/flatten"

import * as d_epe from "exupery-resources/dist/interface/generated/pareto/schemas/execute_procedure_executable/data_types/source"

export type Parameters = {
    'path': string,
    'what':
    | ['dependencies', null]
    | ['dev-dependencies', null],
    'verbose': boolean,
}

export type Error =
    | ['error while running tsc', d_epe.Error]
// | ['could not commit', d_eqe.Error]
// | ['could not push', d_eqe.Error]

export type Resources = {
    'update2latest': _et.Unguaranteed_Procedure<d_epe.Parameters, d_epe.Error, null>
}

export const $$: _et.Unguaranteed_Procedure<Parameters, Error, Resources> = (
    $p, $r
) => {
    return $r.update2latest(
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
                $p.verbose ? _ea.array_literal([`verbose`]) : _ea.array_literal([]),
            ])),
        },
        null,
    ).map_error(($) => ['error while running tsc', $])
}