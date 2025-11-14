import * as _easync from 'exupery-core-async'
import * as _ei from 'exupery-core-internals'
import * as _et from 'exupery-core-types'
import * as _ed from 'exupery-core-dev'
import * as _eb from 'exupery-core-bin'
import * as _ea from 'exupery-core-alg'

import { $$ as op_dictionary_size } from "./dictionary_size"

export const $$ = <Error>(
    $: _et.Dictionary<_et.Unguaranteed_Procedure_Promise<Error>>,
): _et.Unguaranteed_Procedure_Promise<_et.Dictionary<Error>> => {
    return _easync.__create_unguaranteed_procedure({
        'execute': (on_success, on_exception) => {
            let count_down = op_dictionary_size($)
            let has_errors = false

            const errors: { [key: string]: Error } = {}
            const decrement_and_wrap_up_if_done = () => {
                count_down -= 1
                if (count_down === 0) {
                    if (has_errors) {
                        on_exception(_ea.dictionary_literal(errors))
                    } else {
                        on_success()
                    }
                }
            }
            $.map(($, key) => {
                $.__start(
                    () => {
                        decrement_and_wrap_up_if_done()
                    },
                    (e) => {
                        has_errors = true
                        errors[key] = e
                        decrement_and_wrap_up_if_done()
                    },
                )
            })
        }
    })
}