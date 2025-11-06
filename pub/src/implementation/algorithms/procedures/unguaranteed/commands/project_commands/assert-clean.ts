import * as _easync from 'exupery-core-async'
import * as _ei from 'exupery-core-internals'
import * as _et from 'exupery-core-types'
import * as _ed from 'exupery-core-dev'
import * as _eb from 'exupery-core-bin'
import * as _ea from 'exupery-core-alg'

import { $$ as p_log_error } from "exupery-resources/dist/implementation/algorithms/procedures/guaranteed/log_error"
import { $$ as p_api_assert_clean_package } from "../../api/git-assert-clean"

const op_dictionary_size = <T>($: _et.Dictionary<T>): number => {
    let count = 0
    $.map(
        () => {
            count += 1
        }
    )
    return count
}

import { Project_Parameters } from '../../../../../../interface/project_command'


export const $$: _easync.Unguaranteed_Procedure_Initializer<Project_Parameters, _eb.Error> = (
    $p,
) => {
    return _easync.__create_unguaranteed_procedure({
        'execute': (on_success, on_exception) => {
            let count_down = op_dictionary_size($p.packages)
            let has_errors = false
            const decrement_and_wrap_up_if_done = () => {
                count_down -= 1
                if (count_down === 0) {
                    if (has_errors) {
                        on_exception({
                            'exit code': 1,
                        })
                    } else {
                        on_success()
                    }
                }
            }
            $p.packages.map(($, key) => {
                p_api_assert_clean_package({
                    'path': key,
                }).__start(
                    () => {
                        decrement_and_wrap_up_if_done()
                    },
                    () => {
                        has_errors = true
                        decrement_and_wrap_up_if_done()
                    },
                )
            })
        }
    })
}