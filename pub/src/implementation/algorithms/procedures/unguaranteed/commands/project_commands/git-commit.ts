import * as _easync from 'exupery-core-async'
import * as _ei from 'exupery-core-internals'
import * as _et from 'exupery-core-types'
import * as _ed from 'exupery-core-dev'
import * as _eb from 'exupery-core-bin'
import * as _ea from 'exupery-core-alg'

import { $$ as p_log_error } from "exupery-resources/dist/implementation/algorithms/procedures/guaranteed/log_error"
import { $$ as p_api_git_commit } from "../../api/git-commit"

import { $$ as op_remove_first } from "pareto-standard-operations/dist/implementation/algorithms/operations/impure/list/remove_first_element"

import * as d_eqe from "exupery-resources/dist/interface/generated/pareto/schemas/execute_query_executable/data_types/source"

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

import { Project_Parameters } from "../../../../../../interface/project_command"
import { $$ as do_procedure_dict } from "../../../../../../temp/do_unguaranteed_procedure_dictionary"


export const $$: _easync.Unguaranteed_Procedure_Initializer<Project_Parameters, _eb.Error> = (
    $p,
) => {
    return _easync.__create_unguaranteed_procedure({
        'execute': (on_success, on_exception) => {
            op_remove_first($p.arguments).transform(
                ($) => {
                    const commit_message = $.element
                    do_procedure_dict(
                        $p.packages.map(($, key) => {
                            return p_api_git_commit({
                                'path': key,
                                'commit message': commit_message,
                                'stage all changes': true,
                                'push after commit': true,
                            })
                        }),
                    ).__start(
                        () => {
                            _ed.log_debug_message(`git commit for all packages succeeded`, () => { })
                            on_success()
                        },
                        ($) => {
                            _ed.log_debug_message(`project git commit failed`, () => { })

                            const eqe_to_string = ($: d_eqe.Error): string => {
                                return _ea.cc($, ($) => {
                                    switch ($[0]) {
                                        case 'failed to spawn': return _ea.ss($, ($) => {
                                            return `failed to spawn process: ${$.message}`
                                        })
                                        case 'non zero exit code': return _ea.ss($, ($) => {
                                            return `non zero exit code: ${$.exitCode}>${$.stderr}`
                                        })
                                        default: return _ea.au($[0])
                                    }
                                })
                            }

                            $.map(($, key) => {
                                _ea.cc($, ($) => {
                                    switch ($[0]) {
                                        case 'could not determine git status': return _ea.ss($, ($) => {
                                            _ed.log_debug_message(`${key}: could not determine git status: ${eqe_to_string($)}`, () => { })
                                        })
                                        case 'could not stage': return _ea.ss($, ($) => {
                                            _ed.log_debug_message(`${key}: could not stage: ${eqe_to_string($)}`, () => { })
                                        })
                                        case 'could not commit': return _ea.ss($, ($) => {
                                            _ed.log_debug_message(`${key}: could not commit: ${eqe_to_string($)}`, () => { })
                                        })
                                        case 'could not push': return _ea.ss($, ($) => {
                                            _ed.log_debug_message(`${key}: could not push: ${eqe_to_string($)}`, () => { })
                                        })
                                        // case 'working directory is not clean': return _ea.ss($, ($) => {
                                        //     _ed.log_debug_message(`working dir not clean`, () => {})
                                        // })
                                        default: return _ea.au($[0])
                                    }
                                })
                            })
                            on_exception({
                                'exit code': 1,
                            })
                        },
                    )
                },
                log_and_exit(
                    on_exception,
                    _ea.array_literal([`please specify a commit message`])
                )
            )
        }
    })
}