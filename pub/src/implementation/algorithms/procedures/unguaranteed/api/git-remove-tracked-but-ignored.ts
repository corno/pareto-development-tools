import * as _easync from 'exupery-core-async'
import * as _ei from 'exupery-core-internals'
import * as _et from 'exupery-core-types'
import * as _ed from 'exupery-core-dev'
import * as _eb from 'exupery-core-bin'
import * as _ea from 'exupery-core-alg'

import * as d from "../../../../../interface/temp/git_remove_tracked_but_ignored"

import { $$ as pu_assert_git_is_clean } from "./git-assert-clean"

import { $$ as pu_three_steps } from "../../../../../temp/three_steps"

import { $$ as op_flatten } from "pareto-standard-operations/dist/implementation/algorithms/operations/pure/list/flatten"


export const $$: _et.Unguaranteed_Procedure<d.Parameters, d.Error, d.Resources> = (
    $p, $r,
) => {
    return pu_three_steps(
        pu_assert_git_is_clean(
            {
                'path': $p.path,
            },
            $r,
        ),
        $r.procedures.git(
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
                        `rm`,
                        `-r`,
                        `--cached`,
                        `.`
                    ])
                ]))
            },
            null,
        ),
        $r.procedures.git(
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
                        `add`,
                        `--all`,
                    ])
                ]))
            },
            null,
        ),
    ).map_error(($) => _ea.cc($, ($) => {
        switch ($[0]) {
            case 'step1': return _ea.ss($, ($) => _ea.cc($, ($) => {
                switch ($[0]) {
                    case 'working directory is not clean': return _ea.ss($, ($) => ['not clean', null])
                    case 'unexpected error': return _ea.ss($, ($) => ['unexpected error', $])
                    default: return _ea.au($[0])
                }
            }))
            case 'step2': return _ea.ss($, ($) => ['could not remove', $])
            case 'step3': return _ea.ss($, ($) => ['could not add', $])
            default: return _ea.au($[0])
        }
    }))
}