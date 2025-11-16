import * as _easync from 'exupery-core-async'
import * as _ei from 'exupery-core-internals'
import * as _et from 'exupery-core-types'
import * as _ed from 'exupery-core-dev'
import * as _eb from 'exupery-core-bin'
import * as _ea from 'exupery-core-alg'

export const $$ = <Result, Error>(
    $: _et.Dictionary<_easync.Basic_Unguaranteed_Query_Promise<Result, Error>>,
): _et.Unguaranteed_Query_Promise<_et.Dictionary<Result>, _et.Dictionary<Error>> => {
    return _easync.__create_unguaranteed_query({
        'execute': (on_success, on_exception) => {
            let count_down = $.__get_number_of_entries()
            let has_errors = false

            const errors: { [key: string]: Error } = {}
            const results: { [key: string]: Result } = {}
            const decrement_and_wrap_up_if_done = () => {
                count_down -= 1
                if (count_down === 0) {
                    if (has_errors) {
                        on_exception(_ea.dictionary_literal(errors))
                    } else {
                        on_success(_ea.dictionary_literal(results))
                    }
                }
            }
            $.map(($, key) => {
                $.__start(
                    ($) => {
                        results[key] = $
                        decrement_and_wrap_up_if_done()
                    },
                    ($) => {
                        has_errors = true
                        errors[key] = $
                        decrement_and_wrap_up_if_done()
                    },
                )
            })
        }
    })
}