import * as _et from 'exupery-core-types'
import * as _easync from 'exupery-core-async'
import * as _ea from 'exupery-core-alg'

export const $$ = <Procedure_Error>(
    precondition: boolean,
    procedure: _easync.Unguaranteed_Procedure_Promise<Procedure_Error>,
): _easync.Unguaranteed_Procedure_Promise<Procedure_Error> => {
    return {
        __start: (on_success, on_exception) => {
            if (precondition) {
                procedure.__start(
                    on_success,
                    on_exception
                )
            } else {
                on_success()
            }

        }
    }
}
