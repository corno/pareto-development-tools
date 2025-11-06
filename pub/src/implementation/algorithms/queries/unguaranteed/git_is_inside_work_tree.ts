import * as _easync from 'exupery-core-async'
import * as _ei from 'exupery-core-internals'
import * as _et from 'exupery-core-types'
import * as _ed from 'exupery-core-dev'
import * as _eb from 'exupery-core-bin'
import * as _ea from 'exupery-core-alg'

import * as d_eqe from "exupery-resources/dist/interface/generated/pareto/schemas/execute_query_executable/data_types/source"

import { $$ as q_exec } from "exupery-resources/dist/implementation/algorithms/queries/unguaranteed/execute_query_executable"

export type Parameters = {
    'path': string,
}

export type Error =
    | ['could not run git command', {
        'message': string
    }]
    | ['unexpected output', string]

export type Result = boolean

export const $$: _easync.Unguaranteed_Query_Initializer<Parameters, Result, Error> = (
    $p,
) => {
    return _easync.__create_unguaranteed_query({
        'execute': (on_success, on_exception) => {
            q_exec({
                'program': `git`,
                'args': _ea.array_literal([
                    `-C`,
                    $p.path,
                    `rev-parse`,
                    `--is-inside-work-tree`,
                ]),
            }).__start(
                ($) => {
                    if ($.stdout === `true`) {
                        on_success(true)
                    } else {
                        on_exception(['unexpected output', $.stdout])
                    }
                },
                ($) => {
                    _ea.cc($, ($) => {
                        switch ($[0]) {
                            case 'failed to spawn': return _ea.ss($, ($) => {
                                on_exception(['could not run git command', {
                                    'message': $.message
                                }])
                            })
                            case 'non zero exit code': return _ea.ss($, ($) => {
                                if ($.stderr === `fatal: not a git repository (or any of the parent directories): .git`) {
                                    on_success(false)
                                } else {
                                    _ed.log_debug_message(`>${$.stderr}<`, () => { })
                                    on_exception(['unexpected output', $.stderr])
                                }
                            })
                            default: return _ea.au($[0])
                        }
                    })
                }
            )
        }
    })
}