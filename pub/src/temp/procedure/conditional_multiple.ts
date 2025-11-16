import * as _et from 'exupery-core-types'
import * as _easync from 'exupery-core-async'
import * as _ea from 'exupery-core-alg'

import { $$ as do_query_dictionary } from "../query/do_unguaranteed_query_dictionary"

import { $$ as op_dictionary_is_empty } from "pareto-standard-operations/dist/implementation/algorithms/operations/impure/dictionary/is_empty"
import { $$ as op_filter_dictionary } from "pareto-standard-operations/dist/implementation/algorithms/operations/pure/dictionary/filter"

export type Conditional_Error <Precondition_Error, Procedure_Error> =
| ['preconditions', _et.Dictionary<Precondition_Error>]
| ['procedure', Procedure_Error]

export const $$ = <Precondition_Error, Procedure_Error>(
    preconditions: _et.Dictionary<_easync.Basic_Unguaranteed_Query_Promise<boolean, Precondition_Error>>,
    procedure: _et.Unguaranteed_Procedure_Promise<Procedure_Error>,
): _et.Unguaranteed_Procedure_Promise<Conditional_Error<Precondition_Error, Procedure_Error>> => {
    return _easync.__create_unguaranteed_procedure({
        'execute': (on_success, on_exception) => {
            do_query_dictionary(
                preconditions,
            ).__start(
                ($) => {
                    if (op_dictionary_is_empty(op_filter_dictionary($.map(($) => $ ? _ea.not_set() : _ea.set(null))))) {
                        // all preconditions passed
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
                    on_exception(['preconditions', $])
                }
            )
        }
    })
}
