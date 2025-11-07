import * as _easync from 'exupery-core-async'
import * as _ei from 'exupery-core-internals'
import * as _et from 'exupery-core-types'
import * as _ed from 'exupery-core-dev'
import * as _eb from 'exupery-core-bin'
import * as _ea from 'exupery-core-alg'

import { $$ as q_is_git_clean } from "../../../queries/unguaranteed/git_is_clean"

import * as d_gic from "../../../queries/unguaranteed/git_is_clean"

export type Parameters = {
    'path': _et.Optional_Value<string>,
}

export type Error =
    | ['unexpected error', d_gic.Error]
    | ['working directory is not clean', null]

export const $$: _easync.Unguaranteed_Procedure_Initializer<Parameters, Error> = (
    $p,
) => {
    return _easync.__create_unguaranteed_procedure({
        'execute': (on_success, on_exception) => {
            q_is_git_clean({
                'path': $p.path,
            }).__start(
                ($) => {
                    if ($) {
                        on_success()
                    } else {
                        on_exception(['working directory is not clean', null])
                    }
                },
                ($) => {
                    on_exception(['unexpected error', $])
                }
            )
        }
    })
}