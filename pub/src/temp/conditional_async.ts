import * as _et from 'exupery-core-types'
import * as _easync from 'exupery-core-async'
import * as _ea from 'exupery-core-alg'

import { $$ as do_query_dictionary } from "./do_unguaranteed_query_dictionary"

import { $$ as op_dictionary_is_empty } from "pareto-standard-operations/dist/implementation/algorithms/operations/impure/dictionary/is_empty"
import { $$ as op_filter_dictionary } from "pareto-standard-operations/dist/implementation/algorithms/operations/pure/dictionary/filter"

export type Conditional_Error<Precondition_Error, Procedure_Error> =
    | ['precondition', Precondition_Error]
    | ['procedure', Procedure_Error]

export const $$ = <Precondition_Error, Procedure_Error>(
    precondition: _easync.Basic_Unguaranteed_Query_Promise<boolean, Precondition_Error>,
    procedure: _easync.Unguaranteed_Procedure_Promise<Procedure_Error>,
): _easync.Unguaranteed_Procedure_Promise<Conditional_Error<Precondition_Error, Procedure_Error>> => {
    return {
        __start: (on_success, on_exception) => {
            precondition.__start(
                ($) => {
                    if ($) {
                        procedure.__start(
                            on_success,
                            (e) => {
                                on_exception(
                                    ['procedure', e]
                                )
                            }
                        )
                    } else {
                        on_success()
                    }
                },
                ($) => {
                    on_exception(['precondition', $])
                }
            )

        }
    }
}
