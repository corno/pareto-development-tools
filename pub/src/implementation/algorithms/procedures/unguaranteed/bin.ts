import * as _easync from 'exupery-core-async'
import * as _ei from 'exupery-core-internals'
import * as _et from 'exupery-core-types'
import * as _ed from 'exupery-core-dev'
import * as _eb from 'exupery-core-bin'
import * as _ea from 'exupery-core-alg'

import { $$ as p_log_error } from "exupery-resources/dist/implementation/algorithms/procedures/guaranteed/log_error"

import { $$ as op_remove_first } from "pareto-standard-operations/dist/implementation/algorithms/operations/impure/list/remove_first_element"
import { $$ as op_to_list } from "pareto-standard-operations/dist/implementation/algorithms/operations/impure/dictionary/to_list_sorted_by_code_point"
import { $$ as op_flatten } from "pareto-standard-operations/dist/implementation/algorithms/operations/pure/list/flatten"

import { $$ as p_command_assert_clean } from "./commands/assert-clean"
import { $$ as p_command_project } from "./commands/project"

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
            const commands: _et.Dictionary<_easync.Unguaranteed_Procedure_Initializer<_eb.Parameters, _eb.Error>> = _ea.dictionary_literal({
                'assert-clean': p_command_assert_clean,
                'project': p_command_project,
            })
            op_remove_first($p.arguments).transform(
                ($) => {
                    const rest = $.array
                    commands.__get_entry($.element).transform(
                        ($) => {
                            $({
                                'arguments': rest
                            }).__start(
                                on_success,
                                on_exception,
                            )
                        },
                        log_and_exit(
                            on_exception,
                            op_flatten(_ea.array_literal([
                                _ea.array_literal([`unknown command, select from: `]),
                                op_to_list(commands).map(($) => `- ${$.key}`)
                            ]))
                        )
                    )

                },
                log_and_exit(
                    on_exception,
                    op_flatten(_ea.array_literal([
                        _ea.array_literal([`please provide a command to run: `]),
                        op_to_list(commands).map(($) => `- ${$.key}`)
                    ]))
                )
            )
        }
    })
}