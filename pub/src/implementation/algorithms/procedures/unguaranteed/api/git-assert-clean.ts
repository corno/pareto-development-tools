import * as _easync from 'exupery-core-async'
import * as _ei from 'exupery-core-internals'
import * as _et from 'exupery-core-types'
import * as _ed from 'exupery-core-dev'
import * as _eb from 'exupery-core-bin'
import * as _ea from 'exupery-core-alg'

import { $$ as q_is_git_clean } from "../../../queries/unguaranteed/git_is_clean"

import * as d_gic from "../../../../../interface/temp/git_is_clean"

import * as d_eqe from "exupery-resources/dist/interface/generated/pareto/schemas/execute_query_executable/data_types/source"
import * as d_epe from "exupery-resources/dist/interface/generated/pareto/schemas/execute_procedure_executable/data_types/source"

export type Parameters = {
    'path': _et.Optional_Value<string>,
}

export type Error =
    | ['unexpected error', d_gic.Error]
    | ['working directory is not clean', null]

export type Resources = {
    'queries': {
        'git': _et.Unguaranteed_Query_Primed_With_Resources<d_eqe.Parameters, d_eqe.Result, d_eqe.Error>
    }
    'procedures': {
        'git': _et.Unguaranteed_Procedure_Primed_With_Resources<d_epe.Parameters, d_epe.Error>
    }
}

export const $$: _et.Unguaranteed_Procedure<Parameters, Error, Resources> = (
    $r,
) => {
    return ($p) => _easync.__create_unguaranteed_procedure({
        'execute': (on_success, on_exception) => {
            q_is_git_clean($r)(
                {
                    'path': $p.path,
                },
            ).__start(
                ($) => {
                    if ($) {
                        on_success()
                    } else {
                        on_exception(['working directory is not clean', null])
                    }
                },
                ($) => {
                    on_exception(['unexpected error', $])
                }
            )
        }
    })
}