import * as _easync from 'exupery-core-async'
import * as _ei from 'exupery-core-internals'
import * as _et from 'exupery-core-types'
import * as _ed from 'exupery-core-dev'
import * as _eb from 'exupery-core-bin'
import * as _ea from 'exupery-core-alg'

import * as d_eqe from "exupery-resources/dist/interface/generated/pareto/schemas/execute_query_executable/data_types/source"
import * as d_iwt from "./git_is_inside_work_tree"

import { $$ as q_exec } from "exupery-resources/dist/implementation/algorithms/queries/unguaranteed/execute_query_executable"

import { $$ as qu_is_inside_work_tree } from "./git_is_inside_work_tree"

import { $$ as op_flatten } from "pareto-standard-operations/dist/implementation/algorithms/operations/pure/list/flatten"


export type Parameters = {
    'path': _et.Optional_Value<string>,
}

export type Result = boolean

export type Error =
    | ['could not determine git status', d_eqe.Error]
    | ['not a git repository', null]
    | ['unknown issue', d_iwt.Error]

export type Resources = null

export const $$: _easync.Unguaranteed_Query<Parameters, Result, Error, Resources> = (
    $p,
) => {
    return _easync.__create_unguaranteed_query({
        'execute': (on_success, on_exception) => {
            q_exec(
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
                            `status`,
                            `--porcelain`,
                        ])
                    ])),
                },
                null,
            ).__start(
                ($) => {
                    on_success($.stdout === ``)
                },
                ($) => {
                    const err = $

                    qu_is_inside_work_tree(
                        {
                            'path': $p.path
                        },
                        null,
                    ).__start(
                        ($) => {
                            if (!$) {
                                on_exception(['not a git repository', null])
                            } else {
                                on_exception(['could not determine git status', err])
                            }
                        },
                        ($) => {
                            on_exception(['unknown issue', $])
                        }
                    )

                }
            )
        }
    })
}