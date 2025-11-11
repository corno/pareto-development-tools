import * as _easync from 'exupery-core-async'
import * as _ei from 'exupery-core-internals'
import * as _et from 'exupery-core-types'
import * as _ed from 'exupery-core-dev'
import * as _eb from 'exupery-core-bin'
import * as _ea from 'exupery-core-alg'

import * as d_eqe from "exupery-resources/dist/interface/generated/pareto/schemas/execute_query_executable/data_types/source"

import { $$ as op_flatten } from "pareto-standard-operations/dist/implementation/algorithms/operations/pure/list/flatten"

export type Parameters = {
    'path': _et.Optional_Value<string>,
}

export type Result = boolean

export type Error =
    | ['could not run git command', {
        'message': string
    }]
    | ['unexpected output', string]

export type Resources = {
    'queries': {
        'git': _easync.Unguaranteed_Query<d_eqe.Parameters, d_eqe.Result, d_eqe.Error, null>
    }
}

export const $$: _easync.Unguaranteed_Query<Parameters, Result, Error, Resources> = (
    $p, $r,
) => {
    return _easync.__create_unguaranteed_query({
        'execute': (on_success, on_exception) => {
            $r.queries.git(
                {
                    'args': op_flatten(_ea.array_literal([
                        $p.path.transform(
                            ($) => _ea.array_literal([
                                `-C`,
                                $,
                            ]),
                            () => _ea.array_literal([])
                        ),
                        _ea.array_literal([
                            `rev-parse`,
                            `--is-inside-work-tree`,
                        ])
                    ])),
                },
                null,
            ).__start(
                ($) => {
                    if ($.stdout === `true`) {
                        on_success(true)
                    } else {
                        on_exception(['unexpected output', $.stdout])
                    }
                },
                ($) => {
                    _ea.cc($, ($) => {
                        switch ($[0]) {
                            case 'failed to spawn': return _ea.ss($, ($) => {
                                on_exception(['could not run git command', {
                                    'message': $.message
                                }])
                            })
                            case 'non zero exit code': return _ea.ss($, ($) => {
                                if ($['exit code'].transform(($) => $ === 128, () => false)) {
                                    on_success(false)
                                } else {
                                    on_exception(['unexpected output', $.stderr])
                                }
                            })
                            default: return _ea.au($[0])
                        }
                    })
                }
            )
        }
    })
}