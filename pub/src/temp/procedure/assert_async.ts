import * as _et from 'exupery-core-types'
import * as _easync from 'exupery-core-async'
import * as _ea from 'exupery-core-alg'

export type Error<Assertion_Error, Procedure_Error> =
    | ['assertion error', Assertion_Error]
    | ['assertion failed', null]
    | ['procedure error', Procedure_Error]

export const $$ = <Assertion_Error, Procedure_Error>(
    assertion: _et.Unguaranteed_Query_Promise<boolean, Assertion_Error>,
    procedure: _et.Unguaranteed_Procedure_Promise<Procedure_Error>,
): _et.Unguaranteed_Procedure_Promise<Error<Assertion_Error, Procedure_Error>> => {
    return _easync.__create_unguaranteed_procedure({
        'execute': (on_success, on_exception) => {
            assertion.__start(
                ($) => {
                    if ($) {
                        procedure.__start(
                            on_success,
                            ($) => {
                                on_exception(['procedure error', $])
                            }
                        )
                    } else {
                        on_exception(['assertion failed', null])
                    }
                },
                ($) => {
                    on_exception(['assertion error', $])
                }
            )
        }
    })
}
