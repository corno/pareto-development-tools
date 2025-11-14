import * as _easync from 'exupery-core-async'
import * as _ei from 'exupery-core-internals'
import * as _et from 'exupery-core-types'
import * as _ed from 'exupery-core-dev'
import * as _eb from 'exupery-core-bin'
import * as _ea from 'exupery-core-alg'

import { $$ as p_api_git_commit } from "../../api/git-extended-commit"

import { $$ as op_remove_first } from "pareto-standard-operations/dist/implementation/algorithms/operations/impure/list/remove_first_element"

import * as d_eqe from "exupery-resources/dist/interface/generated/pareto/schemas/execute_query_executable/data_types/source"
import * as d_epe from "exupery-resources/dist/interface/generated/pareto/schemas/execute_procedure_executable/data_types/source"
import * as d_log from "exupery-resources/dist/interface/generated/pareto/schemas/log/data_types/source"

import * as t_eqe_to_string from "../../../../transformers/execute_query_executable/text"
import * as t_git_extended_commit_to_text from "../../../../transformers/git_extended_commit/text"

const log_and_exit = (
    on_exception: ($: _eb.Error) => void,
    message: _et.Array<string>,
    p_log_error: _easync.Guaranteed_Procedure<d_log.Parameters, null>
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

import { Project_Parameters } from "../../../../../../interface/project_command"
import { $$ as do_procedure_dict } from "../../../../../../temp/do_unguaranteed_procedure_dictionary"


export type Resources = {
    'queries': {
        'git': _easync.Unguaranteed_Query<d_eqe.Parameters, d_eqe.Result, d_eqe.Error, null>
    }
    'procedures': {
        'git': _easync.Unguaranteed_Procedure<d_epe.Parameters, d_epe.Error, null>
        'log': _easync.Guaranteed_Procedure<d_log.Parameters, null>
    }
}

export const $$: _easync.Unguaranteed_Procedure<Project_Parameters, _eb.Error, Resources> = (
    $p, $r
) => {
    return _easync.__create_unguaranteed_procedure({
        'execute': (on_success, on_exception) => {
            op_remove_first($p.arguments).transform(
                ($) => {
                    const commit_message = $.element
                    do_procedure_dict(
                        $p.packages.map(($, key) => {
                            return p_api_git_commit(
                                {
                                    'path': _ea.set(key),
                                    'commit message': commit_message,
                                    'stage all changes': true,
                                    'push after commit': true,
                                },
                                $r,
                            )
                        }),
                    ).__start(
                        () => {
                            _ed.log_debug_message(`git commit for all packages succeeded`, () => { })
                            on_success()
                        },
                        ($) => {

                            $.map(($, key) => {
                                _ed.log_debug_message(`${key}: ${t_git_extended_commit_to_text.Error($)}`, () => { })
                            })
                            on_exception({
                                'exit code': 1,
                            })
                        },
                    )
                },
                log_and_exit(
                    on_exception,
                    _ea.array_literal([`please specify a commit message`]),
                    $r.procedures.log
                )
            )
        }
    })
}