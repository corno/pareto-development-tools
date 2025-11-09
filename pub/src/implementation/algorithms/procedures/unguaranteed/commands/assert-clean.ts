import * as _easync from 'exupery-core-async'
import * as _ei from 'exupery-core-internals'
import * as _et from 'exupery-core-types'
import * as _ed from 'exupery-core-dev'
import * as _eb from 'exupery-core-bin'
import * as _ea from 'exupery-core-alg'

import { $$ as p_log_error } from "exupery-resources/dist/implementation/algorithms/procedures/guaranteed/log_error"
import { $$ as p_exec } from "exupery-resources/dist/implementation/algorithms/procedures/unguaranteed/execute_procedure_executable"
import { $$ as q_exec } from "exupery-resources/dist/implementation/algorithms/queries/unguaranteed/execute_query_executable"

import { $$ as op_remove_first } from "pareto-standard-operations/dist/implementation/algorithms/operations/impure/list/remove_first_element"
import { $$ as op_flatten } from "pareto-standard-operations/dist/implementation/algorithms/operations/pure/list/flatten"

import { $$ as op_api_assert_clean } from "../api/git-assert-clean"

const execute_procedure_and_write_errors_to_log = <Error>(
    procedure: _easync.Unguaranteed_Procedure_Promise<Error>,
    error_message: _et.Array<string>,
) => {
    return _easync.__create_unguaranteed_procedure({
        'execute': (on_success, on_exception) => {
            procedure.__start(
                on_success,
                ($) => {
                    p_log_error(
                        {
                            'lines': error_message
                        },
                        null,
                    ).__start(
                        () => {
                            on_exception({
                                'exit code': 1,
                            })
                        },
                    )
                }
            )
        }
    })
}

const log_and_exit = (
    on_exception: ($: _eb.Error) => void,
    message: _et.Array<string>,
): () => void => {
    return () => {
        p_log_error(
            {
                'lines': message
            },
            null,
        ).__start(
            () => {
                on_exception({
                    'exit code': 1,
                })
            },
        )
    }
}

export const $$: _easync.Unguaranteed_Procedure<_eb.Parameters, _eb.Error, null> = (
    $p,
) => {
    return _easync.__create_unguaranteed_procedure({
        'execute': (on_success, on_exception) => {

            op_remove_first($p.arguments).transform(
                ($) => {
                    op_api_assert_clean(
                        {
                            'path': _ea.set($.element),
                        },
                        null,
                    ).__start(
                        on_success,
                        () => ({
                            'exit code': 1,
                        }),
                    )
                },
                log_and_exit(
                    on_exception,
                    op_flatten(_ea.array_literal([
                        _ea.array_literal([`please specify a path to the package`]),
                    ]))
                )
            )
        }
    })
}