import * as _easync from 'exupery-core-async'
import * as _ei from 'exupery-core-internals'
import * as _et from 'exupery-core-types'
import * as _ed from 'exupery-core-dev'
import * as _eb from 'exupery-core-bin'
import * as _ea from 'exupery-core-alg'

import { $$ as p_log_error } from "exupery-resources/dist/implementation/algorithms/procedures/guaranteed/log_error"

import { $$ as p_command_assert_clean } from "./project_commands/git-assert-clean"
import { $$ as p_command_git_commit } from "./project_commands/git-extended-commit"
import { $$ as p_command_git_remove_tracked_but_ignored } from "./project_commands/git-remove-tracked-but-ignored"
import { $$ as p_command_build } from "./project_commands/build"
import { $$ as p_update_dependencies } from "./project_commands/update-dependencies"


import { $$ as q_read_dir } from "exupery-resources/dist/implementation/algorithms/queries/unguaranteed/read_directory"

import { $$ as op_remove_first } from "pareto-standard-operations/dist/implementation/algorithms/operations/impure/list/remove_first_element"
import { $$ as op_to_list } from "pareto-standard-operations/dist/implementation/algorithms/operations/impure/dictionary/to_list_sorted_by_code_point"
import { $$ as op_flatten } from "pareto-standard-operations/dist/implementation/algorithms/operations/pure/list/flatten"

import { Project_Parameters } from "../../../../../interface/project_command"

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

export const $$: _easync.Unguaranteed_Procedure_Initializer<_eb.Parameters, _eb.Error, null> = (
    $p,
) => {
    return _easync.__create_unguaranteed_procedure({
        'execute': (on_success, on_exception) => {
            const commands: _et.Dictionary<_easync.Unguaranteed_Procedure_Initializer<Project_Parameters, _eb.Error, null>> = _ea.dictionary_literal({
                'assert-clean': p_command_assert_clean,
                'git-commit': p_command_git_commit,
                'git-remove-tracked-but-ignored': p_command_git_remove_tracked_but_ignored,
                'build': p_command_build,
                'update-dependencies': p_update_dependencies,
            })
            op_remove_first($p.arguments).transform(
                ($) => {
                    const path = $.element
                    op_remove_first($.array).transform(
                        ($) => {
                            const rest_of_the_arguments = $.array
                            commands.__get_entry($.element).transform(
                                ($) => {
                                    const command = $
                                    q_read_dir(
                                        {
                                            'path': {
                                                'escape spaces in path': true,
                                                'path': `${path}/packages`,
                                            },
                                            'prepend results with path': true,
                                        },
                                        null,
                                    ).__start(
                                        ($) => {

                                            command(
                                                {
                                                    'packages': $.map(($) => null),
                                                    'arguments': rest_of_the_arguments
                                                },
                                                null,
                                            ).__start(
                                                on_success,
                                                on_exception,
                                            )
                                        },
                                        log_and_exit(
                                            on_exception,
                                            op_flatten(_ea.array_literal([
                                                _ea.array_literal([`could not read project directory at path: ${path}`]),
                                            ]))
                                        )
                                    )



                                },
                                log_and_exit(
                                    on_exception,
                                    op_flatten(_ea.array_literal([
                                        _ea.array_literal([`unknown project command, select from: `]),
                                        op_to_list(commands).map(($) => `- ${$.key}`)
                                    ]))
                                )
                            )

                        },
                        log_and_exit(
                            on_exception,
                            op_flatten(_ea.array_literal([
                                _ea.array_literal([`please provide a project command to run: `]),
                                op_to_list(commands).map(($) => `- ${$.key}`)
                            ]))
                        )
                    )
                },
                log_and_exit(
                    on_exception,
                    op_flatten(_ea.array_literal([
                        _ea.array_literal([`please provide a path to the project and a command to run: `]),
                        op_to_list(commands).map(($) => `- ${$.key}`)
                    ]))
                )
            )
        }
    })
}