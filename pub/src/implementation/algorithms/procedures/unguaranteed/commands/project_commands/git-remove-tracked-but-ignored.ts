import * as _easync from 'exupery-core-async'
import * as _ei from 'exupery-core-internals'
import * as _et from 'exupery-core-types'
import * as _ed from 'exupery-core-dev'
import * as _eb from 'exupery-core-bin'
import * as _ea from 'exupery-core-alg'

import { $$ as p_api_git_remove_tracked_but_ignored } from "../../api/git-remove-tracked-but-ignored"

import * as d_eqe from "exupery-resources/dist/interface/generated/pareto/schemas/execute_query_executable/data_types/source"

import { Project_Parameters } from "../../../../../../interface/project_command"
import { $$ as do_procedure_dict } from "../../../../../../temp/do_unguaranteed_procedure_dictionary"


export const $$: _easync.Unguaranteed_Procedure_Initializer<Project_Parameters, _eb.Error> = (
    $p,
) => {
    return _easync.__create_unguaranteed_procedure({
        'execute': (on_success, on_exception) => {
            do_procedure_dict(
                $p.packages.map(($, key) => {
                    return p_api_git_remove_tracked_but_ignored({
                        'path': key,
                    })
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
                                case 'not clean': return _ea.ss($, ($) => {
                                    _ed.log_debug_message(`${key}: not clean`, () => { })
                                })
                                case 'unexpected error': return _ea.ss($, ($) => {
                                    _ed.log_debug_message(`${key}: ${_ea.cc($, ($) => {
                                        switch ($[0]) {
                                            case 'not a git repository': return _ea.ss($, ($) => `not a git repository`)
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
                                case 'could not remove': return _ea.ss($, ($) => {
                                    _ed.log_debug_message(`${key}: could not remove: ${eqe_to_string($)}`, () => { })
                                })
                                case 'could not add': return _ea.ss($, ($) => {
                                    _ed.log_debug_message(`${key}: could not add: ${eqe_to_string($)}`, () => { })
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
        }
    })
}