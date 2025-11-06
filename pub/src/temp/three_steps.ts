import * as _et from 'exupery-core-types'
import * as _easync from 'exupery-core-async'
import * as _ea from 'exupery-core-alg'

export type Error<Step_1_Error, Step_2_Error, Step_3_Error> =
    | ['step1', Step_1_Error]
    | ['step2', Step_2_Error]
    | ['step3', Step_3_Error]

export const $$ = <Step_1_Error, Step_2_Error, Step_3_Error>(
    step_1: _easync.Unguaranteed_Procedure<Step_1_Error>,
    step_2: _easync.Unguaranteed_Procedure<Step_2_Error>,
    step_3: _easync.Unguaranteed_Procedure<Step_3_Error>,
): _easync.Unguaranteed_Procedure<Error<Step_1_Error, Step_2_Error, Step_3_Error>> => {
    return {
        __start: (on_success, on_exception) => {
            step_1.__start(
                () => {
                    step_2.__start(
                        () => {
                            step_3.__start(
                                on_success,
                                (error) => {
                                    on_exception(['step3', error])
                                }
                            )
                        },
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
    }
}