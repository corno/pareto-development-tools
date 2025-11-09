import * as _easync from 'exupery-core-async'
import * as _ei from 'exupery-core-internals'
import * as _et from 'exupery-core-types'
import * as _ed from 'exupery-core-dev'
import * as _eb from 'exupery-core-bin'
import * as _ea from 'exupery-core-alg'

import { $$ as pu_epe } from "exupery-resources/dist/implementation/algorithms/procedures/unguaranteed/execute_procedure_executable"

import * as d_eqe from "exupery-resources/dist/interface/generated/pareto/schemas/execute_query_executable/data_types/source"
import * as d_gic from "../../../queries/unguaranteed/git_is_clean"

import { $$ as qu_git_is_clean } from "../../../queries/unguaranteed/git_is_clean"
import { $$ as qu_transform } from "../../../../../temp/transform_query"

import { $$ as pu_conditional_async } from "../../../../../temp/conditional_async"
import { $$ as pu_conditional_sync } from "../../../../../temp/conditional_sync"
import { $$ as pu_three_steps } from "../../../../../temp/three_steps"

import { $$ as op_flatten } from "pareto-standard-operations/dist/implementation/algorithms/operations/pure/list/flatten"

export type Parameters = {
    'path': _et.Optional_Value<string>,
    'commit message': string
    'stage all changes': boolean,
    'push after commit': boolean,
}

export type Error =
    | ['asserting git not clean', d_gic.Error]
    | ['could not stage', d_eqe.Error]
    | ['could not commit', d_eqe.Error]
    | ['could not push', d_eqe.Error]

export type Resources = null

export const $$: _easync.Unguaranteed_Procedure<Parameters, Error, Resources> = (
    $p,
) => {
    return _easync.__create_unguaranteed_procedure({
        'execute': (on_success, on_exception) => {
            pu_conditional_async(
                qu_transform(
                    qu_git_is_clean(
                        {
                            'path': $p.path
                        },
                        null,
                    ),
                    ($) => !$
                ),
                pu_three_steps(
                    pu_conditional_sync(
                        $p['stage all changes'],
                        pu_epe(
                            {
                                'program': `git`,
                                'args': op_flatten(_ea.array_literal([
                                    $p.path.transform(
                                        ($) => _ea.array_literal([
                                            `-C`,
                                            $,
                                        ]),
                                        () => _ea.array_literal([])
                                    ),
                                    _ea.array_literal([
                                        `add`,
                                        `--all`,
                                    ])
                                ])),
                            },
                            null,
                        )
                    ),
                    pu_epe(
                        {
                            'program': `git`,
                            'args': op_flatten(_ea.array_literal([
                                $p.path.transform(
                                    ($) => _ea.array_literal([
                                        `-C`,
                                        $,
                                    ]),
                                    () => _ea.array_literal([])
                                ),
                                _ea.array_literal([
                                    `commit`,
                                    `-m`,
                                    $p['commit message'],
                                ])
                            ])),
                        },
                        null,
                    ),
                    pu_conditional_sync(
                        $p['push after commit'],
                        pu_epe(
                            {
                                'program': `git`,
                                'args': op_flatten(_ea.array_literal([
                                    $p.path.transform(
                                        ($) => _ea.array_literal([
                                            `-C`,
                                            $,
                                        ]),
                                        () => _ea.array_literal([])
                                    ),
                                    _ea.array_literal([
                                        `push`,
                                    ])
                                ]))
                            },
                            null,
                        )
                    )
                ),
            ).__start(
                on_success,
                ($) => {
                    on_exception(_ea.cc($, ($) => {
                        switch ($[0]) {
                            case 'precondition': return _ea.ss($, ($) => ['asserting git not clean', $])
                            case 'procedure': return _ea.ss($, ($) => _ea.cc($, ($) => {
                                switch ($[0]) {
                                    case 'step1': return _ea.ss($, ($) => ['could not stage', $])
                                    case 'step2': return _ea.ss($, ($) => ['could not commit', $])
                                    case 'step3': return _ea.ss($, ($) => ['could not push', $])
                                    default: return _ea.au($[0])
                                }
                            }))
                            default: return _ea.au($[0])
                        }
                    }))
                },
            )
        }
    })
}