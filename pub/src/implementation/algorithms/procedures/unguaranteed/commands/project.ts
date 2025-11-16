import * as _easync from 'exupery-core-async'
import * as _ei from 'exupery-core-internals'
import * as _et from 'exupery-core-types'
import * as _ed from 'exupery-core-dev'
import * as _eb from 'exupery-core-bin'
import * as _ea from 'exupery-core-alg'

import * as d_log from "exupery-resources/dist/interface/generated/pareto/schemas/log/data_types/source"
import * as d_write_to_stderr from "exupery-resources/dist/interface/generated/pareto/schemas/write_to_stderr/data_types/source"
import * as d_eqe from "exupery-resources/dist/interface/generated/pareto/schemas/execute_query_executable/data_types/source"
import * as d_epe from "exupery-resources/dist/interface/generated/pareto/schemas/execute_procedure_executable/data_types/source"
import * as d_e_smelly_pe from "exupery-resources/dist/interface/generated/pareto/schemas/execute_smelly_procedure_executable/data_types/source"
import * as d_read_directory from "exupery-resources/dist/interface/generated/pareto/schemas/read_directory/data_types/source"
import { Project_Parameters } from "../../../../../interface/project_command"


export type Resources = {
    'queries': {
        'git': _et.Unguaranteed_Query_Primed_With_Resources<d_eqe.Parameters, d_eqe.Result, d_eqe.Error>
        'read directory': _et.Unguaranteed_Query_Primed_With_Resources<d_read_directory.Parameters, d_read_directory.Result, d_read_directory.Error>
    },
    'procedures': {
        'git': _et.Unguaranteed_Procedure_Primed_With_Resources<d_epe.Parameters, d_epe.Error>
        'log': _et.Guaranteed_Procedure_Primed_With_Resources<d_log.Parameters>
        'node': _et.Unguaranteed_Procedure_Primed_With_Resources<d_epe.Parameters, d_epe.Error>
        'npm': _et.Unguaranteed_Procedure_Primed_With_Resources<d_epe.Parameters, d_epe.Error>
        'tsc': _et.Unguaranteed_Procedure_Primed_With_Resources<d_e_smelly_pe.Parameters, d_e_smelly_pe.Error>
        'update2latest': _et.Unguaranteed_Procedure_Primed_With_Resources<d_epe.Parameters, d_epe.Error>
        'write to stderr': _et.Guaranteed_Procedure_Primed_With_Resources<d_write_to_stderr.Parameters>

    }
}

export type Command_Resources = {
    'queries': {
        'git': _et.Unguaranteed_Query_Primed_With_Resources<d_eqe.Parameters, d_eqe.Result, d_eqe.Error>
    },
    'procedures': {
        'git': _et.Unguaranteed_Procedure_Primed_With_Resources<d_epe.Parameters, d_epe.Error>
        'log': _et.Guaranteed_Procedure_Primed_With_Resources<d_log.Parameters>
        'node': _et.Unguaranteed_Procedure_Primed_With_Resources<d_epe.Parameters, d_epe.Error>
        'npm': _et.Unguaranteed_Procedure_Primed_With_Resources<d_epe.Parameters, d_epe.Error>
        'tsc': _et.Unguaranteed_Procedure_Primed_With_Resources<d_e_smelly_pe.Parameters, d_e_smelly_pe.Error>
        'update2latest': _et.Unguaranteed_Procedure_Primed_With_Resources<d_epe.Parameters, d_epe.Error>
        'write to stderr': _et.Guaranteed_Procedure_Primed_With_Resources<d_write_to_stderr.Parameters>

    }
}

import { $$ as p_command_assert_clean } from "./project_commands/git-assert-clean"
import { $$ as p_command_git_commit } from "./project_commands/git-extended-commit"
import { $$ as p_command_git_remove_tracked_but_ignored } from "./project_commands/git-remove-tracked-but-ignored"
import { $$ as p_command_build } from "./project_commands/build"
import { $$ as p_command_build_and_test } from "./project_commands/build-and-test"
import { $$ as p_update_dependencies } from "./project_commands/update-dependencies"

import { $$ as op_remove_first } from "pareto-standard-operations/dist/implementation/algorithms/operations/impure/list/pop_first_element"
import { $$ as op_to_list } from "pareto-standard-operations/dist/implementation/algorithms/operations/impure/dictionary/to_list_sorted_by_insertion"
import { $$ as op_flatten } from "pareto-standard-operations/dist/implementation/algorithms/operations/pure/list/flatten"


const log_and_exit = (
    on_exception: ($: _eb.Error) => void,
    message: _et.Array<string>,
    p_log_error: _et.Guaranteed_Procedure_Primed_With_Resources<d_log.Parameters>
): () => void => {
    return () => {
        p_log_error(
            {
                'lines': message
            },
        ).__start(
            () => {
                on_exception({
                    'exit code': 1,
                })
            },
        )
    }
}

export const $$: _et.Unguaranteed_Procedure<_eb.Parameters, _eb.Error, Resources> = (
    $r,
) => {
    return ($p) => _easync.__create_unguaranteed_procedure({
        'execute': (on_success, on_exception) => {
            const commands: _et.Dictionary<_et.Unguaranteed_Procedure<Project_Parameters, _eb.Error, Command_Resources>> = _ea.dictionary_literal({
                'assert-clean': p_command_assert_clean,
                'git-commit': p_command_git_commit,
                'git-remove-tracked-but-ignored': p_command_git_remove_tracked_but_ignored,
                'build': ($r) => ($p) => {
                    return _easync.__create_unguaranteed_procedure({
                        'execute': (on_success, on_error) => p_command_build($r)(
                            $p,
                        ).__start(
                            on_success,
                            on_error,
                        )
                    })
                },
                'build-and-test': ($r) => ($p) => {
                    return _easync.__create_unguaranteed_procedure({
                        'execute': (on_success, on_error) => p_command_build_and_test($r)(
                            $p,
                        ).__start(
                            on_success,
                            on_error,
                        )
                    })
                },
                'update-dependencies': ($r) => ($p) => {
                    return _easync.__create_unguaranteed_procedure({
                        'execute': (on_success, on_error) => p_update_dependencies($r)(
                            $p,
                        ).__start(
                            on_success,
                            on_error,
                        )
                    })
                },
            })
            op_remove_first($p.arguments).transform(
                ($) => {
                    const path = $.element
                    op_remove_first($.rest).transform(
                        ($) => {
                            const rest_of_the_arguments = $.rest
                            commands.__get_entry($.element).transform(
                                ($) => {
                                    const command = $
                                    $r.queries['read directory'](
                                        {
                                            'path': {
                                                'escape spaces in path': true,
                                                'path': `${path}/packages`,
                                            },
                                            'prepend results with path': true,
                                        },
                                    ).__start(
                                        ($) => {

                                            command($r)(
                                                {
                                                    'packages': $.map(($) => null),
                                                    'arguments': rest_of_the_arguments
                                                },
                                            ).__start(
                                                on_success,
                                                on_exception,
                                            )
                                        },
                                        log_and_exit(
                                            on_exception,
                                            op_flatten(_ea.array_literal([
                                                _ea.array_literal([`could not read project directory at path: ${path}`]),
                                            ])),
                                            $r.procedures.log,
                                        )
                                    )



                                },
                                log_and_exit(
                                    on_exception,
                                    op_flatten(_ea.array_literal([
                                        _ea.array_literal([`unknown project command, select from: `]),
                                        op_to_list(commands).map(($) => `- ${$.key}`)
                                    ])),
                                    $r.procedures.log,
                                )
                            )

                        },
                        log_and_exit(
                            on_exception,
                            op_flatten(_ea.array_literal([
                                _ea.array_literal([`please provide a project command to run: `]),
                                op_to_list(commands).map(($) => `- ${$.key}`)
                            ])),
                            $r.procedures.log,
                        )
                    )
                },
                log_and_exit(
                    on_exception,
                    op_flatten(_ea.array_literal([
                        _ea.array_literal([`please provide a path to the project and a command to run: `]),
                        op_to_list(commands).map(($) => `- ${$.key}`)
                    ])),
                    $r.procedures.log,
                )
            )
        }
    })
}