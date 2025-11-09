import * as _easync from 'exupery-core-async'
import * as _ei from 'exupery-core-internals'
import * as _et from 'exupery-core-types'
import * as _ed from 'exupery-core-dev'
import * as _eb from 'exupery-core-bin'
import * as _ea from 'exupery-core-alg'

import { $$ as p_log_error } from "exupery-resources/dist/implementation/algorithms/procedures/guaranteed/log_error"
import { $$ as p_api_git_commit } from "../../api/git-extended-commit"

import { $$ as op_remove_first } from "pareto-standard-operations/dist/implementation/algorithms/operations/impure/list/remove_first_element"

import * as d_eqe from "exupery-resources/dist/interface/generated/pareto/schemas/execute_query_executable/data_types/source"

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

import { Project_Parameters } from "../../../../../../interface/project_command"
import { $$ as do_procedure_dict } from "../../../../../../temp/do_unguaranteed_procedure_dictionary"


export const $$: _easync.Unguaranteed_Procedure<Project_Parameters, _eb.Error, null> = (
    $p,
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
                                null,
                            )
                        }),
                    ).__start(
                        () => {
                            _ed.log_debug_message(`git commit for all packages succeeded`, () => { })
                            on_success()
                        },
                        ($) => {
                            const eqe_to_string = ($: d_eqe.Error): string => {
                                return _ea.cc($, ($) => {
                                    switch ($[0]) {
                                        case 'failed to spawn': return _ea.ss($, ($) => {
                                            return `failed to spawn process: ${$.message}`
                                        })
                                        case 'non zero exit code': return _ea.ss($, ($) => {
                                            return `non zero exit code: ${$['exit code'].transform(($) => `` + $, () => `-`)}>${$.stderr}`
                                        })
                                        default: return _ea.au($[0])
                                    }
                                })
                            }

                            $.map(($, key) => {
                                _ea.cc($, ($) => {
                                    switch ($[0]) {
                                        case 'asserting git not clean': return _ea.ss($, ($) => {
                                            _ed.log_debug_message(`${key}: error while asserting git is not clean: ${_ea.cc($, ($) => {
                                                switch ($[0]) {
                                                    case 'not a git repository': return _ea.ss($, ($) => `not a git rep`)
                                                    case 'could not determine git status': return _ea.ss($, ($) => `could not determine status, ${eqe_to_string($)}`)
                                                    case 'unknown issue': return _ea.ss($, ($) => `unknown issue: ${_ea.cc($, ($) => {
                                                        switch ($[0]) {
                                                            case 'could not run git command': return _ea.ss($, ($) => `could not run git command: ${$.message}`)
                                                            case 'unexpected output': return _ea.ss($, ($) => `unexpected output: ${$}`)
                                                            default: return _ea.au($[0])
                                                        }
                                                    })}`)
                                                    default: return _ea.au($[0])
                                                }
                                            })}`, () => { })
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