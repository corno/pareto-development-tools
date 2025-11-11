import * as _easync from 'exupery-core-async'
import * as _ei from 'exupery-core-internals'
import * as _et from 'exupery-core-types'
import * as _ed from 'exupery-core-dev'
import * as _eb from 'exupery-core-bin'
import * as _ea from 'exupery-core-alg'

import * as d_epe from "exupery-resources/dist/interface/generated/pareto/schemas/execute_procedure_executable/data_types/source"
import * as d_eqe from "exupery-resources/dist/interface/generated/pareto/schemas/execute_query_executable/data_types/source"
import * as d_gic from "../../../queries/unguaranteed/git_is_clean"

import { $$ as pu_assert_git_is_clean } from "./git-assert-clean"

import { $$ as pu_three_steps } from "../../../../../temp/three_steps"

export type Parameters = {
    'path': _et.Optional_Value<string>,
}

import { $$ as op_flatten } from "pareto-standard-operations/dist/implementation/algorithms/operations/pure/list/flatten"

export type Error =
    | ['not clean', null]
    | ['could not remove', d_eqe.Error]
    | ['could not add', d_eqe.Error]
    | ['unexpected error', d_gic.Error]

export type Resources = {
    'queries': {
        'git': _easync.Unguaranteed_Query<d_eqe.Parameters, d_eqe.Result, d_eqe.Error, null>
    }
    'procedures': {
        'git': _easync.Unguaranteed_Procedure<d_epe.Parameters, d_epe.Error, null>
    }
}

export const $$: _easync.Unguaranteed_Procedure<Parameters, Error, Resources> = (
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