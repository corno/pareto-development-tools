import * as _easync from 'exupery-core-async'
import * as _ei from 'exupery-core-internals'
import * as _et from 'exupery-core-types'
import * as _ed from 'exupery-core-dev'
import * as _eb from 'exupery-core-bin'
import * as _ea from 'exupery-core-alg'

import * as d_ud from "../../api/update-dependencies"
import * as d_utd from "../../api/update-typescript-dependencies"

import { $$ as p_api_update_dependencies } from "../../api/update-dependencies"

import { Project_Parameters } from "../../../../../../interface/project_command"

import { $$ as do_procedure_dict } from "../../../../../../temp/do_unguaranteed_procedure_dictionary"

import { $$ as p_write_to_stderr } from "exupery-resources/dist/implementation/algorithms/procedures/guaranteed/write_to_stderr"

import { $$ as op_dictionary_to_list } from "pareto-standard-operations/dist/implementation/algorithms/operations/impure/dictionary/to_list_sorted_by_code_point"
import { $$ as op_join } from "pareto-standard-operations/dist/implementation/algorithms/operations/pure/text/join_list_of_texts"


export const $$: _easync.Unguaranteed_Procedure_Initializer<Project_Parameters, _eb.Error> = (
    $p,
) => {
    return _easync.__create_unguaranteed_procedure({
        'execute': (on_success, on_exception) => {
            do_procedure_dict(
                $p.packages.map(($, key) => {
                    return p_api_update_dependencies({
                        'path': key,
                    })
                }),
            ).__start(
                on_success,
                ($) => {
                    const t_utd_error_to_string = ($: d_utd.Error): string => {
                        return _ea.cc($, ($) => {
                            switch ($[0]) {
                                case 'could not clean': return _ea.ss($, ($) => `could not clean working directory before updating typescript dependencies: ${_ea.cc($, ($) => {
                                    switch ($[0]) {
                                        case 'unexpected error': return _ea.ss($, ($) => `unexpected error: ${_ea.cc($, ($) => {
                                            switch ($[0]) {
                                                case 'failed to spawn':return _ea.ss($, ($) => `failed to spawn process: ${$.message}`)
                                                case 'non zero exit code': return _ea.ss($, ($) => `non zero exit code: ${$.stderr}`)
                                                default: return _ea.au($[0])
                                            }
                                        })}`)
                                        default: return _ea.au($[0])
                                    }
                                })}`)
                                case 'could not update to latest': return _ea.ss($, ($) => `could not update to latest dependencies`)
                                case 'could not install': return _ea.ss($, ($) => `could not install typescript dependencies, ${_ea.cc($, ($) => {
                                    switch ($[0]) {
                                        case 'error while running tsc': return _ea.ss($, ($) => `error while running tsc: ${_ea.cc($, ($) => {
                                            switch ($[0]) {
                                                case 'failed to spawn':return _ea.ss($, ($) => `failed to spawn process: ${$.message}`)
                                                case 'non zero exit code': return _ea.ss($, ($) => `non zero exit code: ${$.stderr}`)
                                                default: return _ea.au($[0])
                                            }
                                        })}`)
                                        default: return _ea.au($[0])
                                    }
                                })}`)
                                default: return _ea.au($[0])
                            }
                        })
                    }
                    // const t_ud_error_to_string = ($: d_ud.Error): string => {
                    //     return _ea.cc($, ($): string => {
                    //         switch ($[0]) {
                    //             case 'error building pub': return _ea.ss($, ($) => t_utd_to_string($))
                    //             case 'error building test': return _ea.ss($, ($) => t_utd_to_string($))
                    //             default: return _ea.au($[0])
                    //         }
                    //     })
                    // }
                    const data: string = op_join(
                        op_dictionary_to_list(
                            $.map(($, key): string => {
                                return _ea.cc($, ($) => {
                                    switch ($[0]) {
                                        case 'error building pub': return _ea.ss($, ($) => `${key}/pub: ${t_utd_error_to_string($)}\n`)
                                        case 'error building test': return _ea.ss($, ($) => `${key}/test: ${t_utd_error_to_string($)}\n`)
                                        default: return _ea.au($[0])
                                    }
                                })
                            })

                        ).map(($) => $.value)
                    )
                    p_write_to_stderr(data).__start(
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