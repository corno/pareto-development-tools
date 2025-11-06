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

const log_and_exit = (
    on_exception: ($: _eb.Error) => void,
    message: _et.Array<string>,
): () => void => {
    return () => {
        p_log_error({
            'lines': message
        }).__start(
            () => {
                on_exception({
                    'exit code': 1,
                })
            },
        )
    }
}

export const $$: _easync.Unguaranteed_Procedure_Initializer<_eb.Parameters, _eb.Error> = (
    $p,
) => {
    return _easync.__create_unguaranteed_procedure({
        'execute': (on_success, on_exception) => {

            op_remove_first($p.arguments).transform(
                ($) => {
                    const path = $.element
                    q_exec({
                        'program': `git`,
                        'args': _ea.array_literal([
                            `-C`,
                            path,
                            `status`,
                            `--porcelain`,
                        ]),
                    }).__start(
                        ($) => {
                            if ($.stdout === ``) {
                                on_success()
                            } else {
                                p_log_error({
                                    'lines': op_flatten(_ea.array_literal([
                                        _ea.array_literal([`The working directory of ${path} is not clean:`]),
                                        _ea.array_literal([$.stdout]),
                                    ]))
                                }).__start(
                                    () => {
                                        on_exception({
                                            'exit code': 1,
                                        })
                                    },
                                )
                            }
                        },
                        ($) => {
                            p_log_error({
                                'lines': op_flatten(_ea.array_literal([
                                    _ea.array_literal([`Could not determine git status`]),
                                    _ea.cc($, ($) => {
                                        switch ($[0]) {
                                            case 'failed to spawn': return _ea.ss($, ($) => _ea.array_literal([`failed to spawn: ${$.message}`]))
                                            case 'non zero exit code': return _ea.ss($, ($) => _ea.array_literal([`non zero exit code: ${$.exitCode}`]))
                                            default: return _ea.au($[0])
                                        }
                                    }),
                                ]))
                            }).__start(
                                () => {
                                    on_exception({
                                        'exit code': 1,
                                    })
                                },
                            )
                        }
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