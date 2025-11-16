import * as _et from 'exupery-core-types'
import * as _easync from 'exupery-core-async'
import * as _ea from 'exupery-core-alg'

const op_dictionary_to_list_based_on_insertion_order = <T>(
    dict: _et.Dictionary<T>,
): _et.Array<{ key: string, value: T }> => {
    return _ea.build_list<{ key: string, value: T }>(($i) => {
        dict.map(($, key) => {
            $i['add element']({ key, value: $ })
        })
    })
}

export type Error<Err> = {
    'error': Err
    'step': string
}

export const $$ = <Err>(
    steps: _et.Dictionary<_et.Unguaranteed_Procedure_Promise<Err>>,
): _et.Unguaranteed_Procedure_Promise<Error<Err>> => {
    return _easync.__create_unguaranteed_procedure({
        'execute': (on_success, on_exception) => {
            const as_list = op_dictionary_to_list_based_on_insertion_order(steps)

            let current = 0

            const do_next = () => {
                as_list.__get_element_at(current).transform(
                    ($) => {
                        const key = $.key
                        current += 1
                        $.value.__start(
                            () => {
                                do_next()
                            },
                            ($) => {
                                on_exception({
                                    'error': $,
                                    'step': key,
                                })
                            }
                        )
                    },
                    () => {
                        on_success()
                    }
                )
            }
            do_next()
        }
    })
}