import * as _et from 'exupery-core-types'
import * as _easync from 'exupery-core-async'
import * as _ea from 'exupery-core-alg'

export type Error<Procedure_Error> =
    | ['assertion failed', null]
    | ['procedure error', Procedure_Error]

export const $$ = <Assertion_Error, Procedure_Error>(
    assertion: boolean,
    procedure: _easync.Unguaranteed_Procedure_Promise<Procedure_Error>,
): _easync.Unguaranteed_Procedure_Promise<Error<Procedure_Error>> => {
    return {
        __start: (on_success, on_exception) => {
            if (!assertion) {
                on_exception(['assertion failed', null])
                return
            }
            procedure.__start(
                on_success,
                ($) => {
                    on_exception(['procedure error', $])
                }
            )
        }
    }
}