import * as _et from 'exupery-core-types'
import * as _easync from 'exupery-core-async'
import * as _ea from 'exupery-core-alg'

export type Error<Step_1_Error, Step_2_Error> =
    | ['step1', Step_1_Error]
    | ['step2', Step_2_Error]

export const $$ = <Step_1_Error, Step_2_Error>(
    step_1: _easync.Unguaranteed_Procedure_Promise<Step_1_Error>,
    step_2: _easync.Unguaranteed_Procedure_Promise<Step_2_Error>,
): _easync.Unguaranteed_Procedure_Promise<Error<Step_1_Error, Step_2_Error>> => {
    return _easync.__create_unguaranteed_procedure({
        'execute': (on_success, on_exception) => {
            step_1.__start(
                () => {
                    step_2.__start(
                        on_success,
                        (error) => {
                            on_exception(['step2', error])
                        }
                    )
                },
                (error) => {
                    on_exception(['step1', error])
                }
            )
        }
    })
}