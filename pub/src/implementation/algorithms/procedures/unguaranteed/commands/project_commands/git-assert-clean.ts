import * as _easync from 'exupery-core-async'
import * as _ei from 'exupery-core-internals'
import * as _et from 'exupery-core-types'
import * as _ed from 'exupery-core-dev'
import * as _eb from 'exupery-core-bin'
import * as _ea from 'exupery-core-alg'

import { $$ as p_api_assert_clean_package } from "../../api/git-assert-clean"

import { Project_Parameters } from "../../../../../../interface/project_command"

import { $$ as do_procedure_dict } from "../../../../../../temp/do_unguaranteed_procedure_dictionary"

import * as d_eqe from "exupery-resources/dist/interface/generated/pareto/schemas/execute_query_executable/data_types/source"
import * as d_epe from "exupery-resources/dist/interface/generated/pareto/schemas/execute_procedure_executable/data_types/source"

export type Resources = {
    'queries': {
        'git': _easync.Unguaranteed_Query<d_eqe.Parameters, d_eqe.Result, d_eqe.Error, null>
    }
    'procedures': {
        'git': _easync.Unguaranteed_Procedure<d_epe.Parameters, d_epe.Error, null>
    }
}



export const $$: _easync.Unguaranteed_Procedure<Project_Parameters, _eb.Error, Resources> = (
    $p, $r
) => {
    return _easync.__create_unguaranteed_procedure({
        'execute': (on_success, on_exception) => {
            do_procedure_dict(
                $p.packages.map(($, key) => {
                    return p_api_assert_clean_package(
                        {
                            'path': _ea.set(key),
                        },
                        $r,
                    )
                }),
            ).__start(
                on_success,
                ($) => {
                    _ed.log_debug_message(`clean errors`, () => { })
                    on_exception({
                        'exit code': 1
                    })
                }
            )
        }
    })
}