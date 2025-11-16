import * as _easync from 'exupery-core-async'
import * as _ei from 'exupery-core-internals'
import * as _et from 'exupery-core-types'
import * as _ed from 'exupery-core-dev'
import * as _eb from 'exupery-core-bin'
import * as _ea from 'exupery-core-alg'

import { $$ as qu_is_inside_work_tree } from "./git_is_inside_work_tree"

import { $$ as op_flatten } from "pareto-standard-operations/dist/implementation/algorithms/operations/pure/list/flatten"

import * as d from "../../../../interface/temp/git_is_clean"


export const $$: _et.Unguaranteed_Query<d.Parameters, d.Result, d.Error, d.Resources> = (
    $r,
) => {
    return ($p) => _easync.__create_unguaranteed_query({
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
                            `status`,
                            `--porcelain`,
                        ])
                    ])),
                },
            ).__start(
                ($) => {
                    on_success($.stdout === ``)
                },
                ($) => {
                    const err = $

                    qu_is_inside_work_tree($r)(
                        {
                            'path': $p.path
                        },
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