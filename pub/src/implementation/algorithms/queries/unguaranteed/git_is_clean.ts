import * as _easync from 'exupery-core-async'
import * as _ei from 'exupery-core-internals'
import * as _et from 'exupery-core-types'
import * as _ed from 'exupery-core-dev'
import * as _eb from 'exupery-core-bin'
import * as _ea from 'exupery-core-alg'

import { $$ as p_log_error } from "exupery-resources/dist/implementation/algorithms/procedures/guaranteed/log_error"

import * as d_eqe from "exupery-resources/dist/interface/generated/pareto/schemas/execute_query_executable/data_types/source"

import { $$ as q_exec } from "exupery-resources/dist/implementation/algorithms/queries/unguaranteed/execute_query_executable"

import { $$ as op_remove_first } from "pareto-standard-operations/dist/implementation/algorithms/operations/impure/list/remove_first_element"
import { $$ as op_flatten } from "pareto-standard-operations/dist/implementation/algorithms/operations/pure/list/flatten"


export type Parameters = {
    'path': string,
}

export type Error =
    | ['could not determine git status', d_eqe.Error]

export type Result = boolean

export const $$: _easync.Unguaranteed_Query_Initializer<Parameters, Result, Error> = (
    $p,
) => {
    return _easync.__create_unguaranteed_query({
        'execute': (on_success, on_exception) => {
            q_exec({
                'program': `git`,
                'args': _ea.array_literal([
                    `-C`,
                    $p.path,
                    `status`,
                    `--porcelain`,
                ]),
            }).__start(
                ($) => {
                    on_success($.stdout === ``)
                },
                ($) => {
                    on_exception(['could not determine git status', $])
                }
            )
        }
    })
}