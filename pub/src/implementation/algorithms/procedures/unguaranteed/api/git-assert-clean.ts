import * as _easync from 'exupery-core-async'
import * as _ei from 'exupery-core-internals'
import * as _et from 'exupery-core-types'
import * as _ed from 'exupery-core-dev'
import * as _eb from 'exupery-core-bin'
import * as _ea from 'exupery-core-alg'

import { $$ as p_log_error } from "exupery-resources/dist/implementation/algorithms/procedures/guaranteed/log_error"

import { $$ as q_exec } from "exupery-resources/dist/implementation/algorithms/queries/unguaranteed/execute_query_executable"
import { $$ as q_is_git_clean } from "../../../queries/unguaranteed/git_is_clean"

import { $$ as op_remove_first } from "pareto-standard-operations/dist/implementation/algorithms/operations/impure/list/remove_first_element"
import { $$ as op_flatten } from "pareto-standard-operations/dist/implementation/algorithms/operations/pure/list/flatten"

import * as d_eqe from "exupery-resources/dist/interface/generated/pareto/schemas/execute_query_executable/data_types/source"

export type Parameters = {
    'path': string,
}



export type Error =
    | ['could not determine git status', d_eqe.Error]
    | ['working directory is not clean', null]

export const $$: _easync.Unguaranteed_Procedure_Initializer<Parameters, Error> = (
    $p,
) => {
    return _easync.__create_unguaranteed_procedure({
        'execute': (on_success, on_exception) => {
            q_is_git_clean({
                'path': $p.path,
            }).__start(
                ($) => {
                    if ($) {
                        on_success()
                    } else {
                        on_exception(['working directory is not clean', null])
                    }
                },
                ($) => {
                    on_exception($)
                }
            )
        }
    })
}