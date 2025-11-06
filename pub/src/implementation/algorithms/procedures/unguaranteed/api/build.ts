import * as _easync from 'exupery-core-async'
import * as _ei from 'exupery-core-internals'
import * as _et from 'exupery-core-types'
import * as _ed from 'exupery-core-dev'
import * as _eb from 'exupery-core-bin'
import * as _ea from 'exupery-core-alg'

import { $$ as pu_tsc } from "./tsc"

import { $$ as pu_two_steps } from "../../../../../temp/two_steps"

import * as d_tsc from "./tsc"

export type Parameters = {
    'path': string,
}

export type Error =
    | ['error building pub', d_tsc.Error]
    | ['error building test', d_tsc.Error]


export const $$: _easync.Unguaranteed_Procedure_Initializer<Parameters, Error> = (
    $p,
) => {
    return _easync.__create_unguaranteed_procedure({
        'execute': (on_success, on_exception) => {
            pu_two_steps(
                pu_tsc({
                    'path': _ea.set($p.path + `/pub`),
                }),
                pu_tsc({
                    'path': _ea.set($p.path + `/test`),
                }),
            ).__start(
                on_success,
                ($) => {
                    _ea.cc($, ($) => {
                        switch ($[0]) {
                            case 'step1': return _ea.ss($, ($) => {
                                on_exception(['error building pub', $])
                            })
                            case 'step2': return _ea.ss($, ($) => {
                                on_exception(['error building test', $])
                            })
                            default: return _ea.au($[0])
                        }
                    })
                },
            )
        }
    })
}