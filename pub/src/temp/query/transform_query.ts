import * as _et from 'exupery-core-types'
import * as _easync from 'exupery-core-async'
import * as _ea from 'exupery-core-alg'

export const $$ = <In, Out, Error>(
    query: _easync.Basic_Unguaranteed_Query_Promise<In, Error>,
    transform: ($: In) => Out,
): _et.Unguaranteed_Query_Promise<Out, Error> => {
    return _easync.__create_unguaranteed_query({
        'execute': (on_success, on_exception) => {
            query.__start(
                ($) => {
                    on_success(transform($))
                },
                (e) => {
                    on_exception(e)
                }
            )
        }
    })
}
