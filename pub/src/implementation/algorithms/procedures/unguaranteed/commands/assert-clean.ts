import * as _easync from 'exupery-core-async'
import * as _ei from 'exupery-core-internals'
import * as _et from 'exupery-core-types'
import * as _ed from 'exupery-core-dev'
import * as _eb from 'exupery-core-bin'
import * as _ea from 'exupery-core-alg'

import { $$ as op_remove_first } from "pareto-standard-operations/dist/implementation/algorithms/operations/impure/list/pop_first_element"
import { $$ as op_flatten } from "pareto-standard-operations/dist/implementation/algorithms/operations/pure/list/flatten"

import { $$ as op_api_assert_clean } from "../api/git-assert-clean"

import * as d_eqe from "exupery-resources/dist/interface/generated/pareto/schemas/execute_query_executable/data_types/source"
import * as d_epe from "exupery-resources/dist/interface/generated/pareto/schemas/execute_procedure_executable/data_types/source"
import * as d_log from "exupery-resources/dist/interface/generated/pareto/schemas/log/data_types/source"

export type Resources = {
    'queries': {
        'git': _et.Unguaranteed_Query_Primed_With_Resources<d_eqe.Parameters, d_eqe.Result, d_eqe.Error>
    }
    'procedures': {
        'git': _et.Unguaranteed_Procedure_Primed_With_Resources<d_epe.Parameters, d_epe.Error>
        'log': _et.Guaranteed_Procedure_Primed_With_Resources<d_log.Parameters>
    }
}



const log_and_exit = (
    on_exception: ($: _eb.Error) => void,
    message: _et.Array<string>,
    p_log_error: _et.Guaranteed_Procedure_Primed_With_Resources<d_log.Parameters>
): () => void => {
    return () => {
        p_log_error(
            {
                'lines': message
            },
        ).__start(
            () => {
                on_exception({
                    'exit code': 1,
                })
            },
        )
    }
}
export const $$: _et.Unguaranteed_Procedure<_eb.Parameters, _eb.Error, Resources> = (
    $r
) => {
    return ($p) => _easync.__create_unguaranteed_procedure({
        'execute': (on_success, on_exception) => {

            op_remove_first($p.arguments).transform(
                ($) => {
                    op_api_assert_clean($r)(
                        {
                            'path': _ea.set($.element),
                        },
                    ).__start(
                        on_success,
                        () => ({
                            'exit code': 1,
                        }),
                    )
                },
                log_and_exit(
                    on_exception,
                    op_flatten(_ea.array_literal([
                        _ea.array_literal([`please specify a path to the package`]),
                    ])),
                    $r.procedures.log,
                )
            )
        }
    })
}