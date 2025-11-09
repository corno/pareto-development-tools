import * as _easync from 'exupery-core-async'
import * as _ei from 'exupery-core-internals'
import * as _et from 'exupery-core-types'
import * as _ed from 'exupery-core-dev'
import * as _eb from 'exupery-core-bin'
import * as _ea from 'exupery-core-alg'

import { $$ as p_api_assert_clean_package } from "../../api/git-assert-clean"

import { Project_Parameters } from "../../../../../../interface/project_command"

import { $$ as do_procedure_dict } from "../../../../../../temp/do_unguaranteed_procedure_dictionary"


export const $$: _easync.Unguaranteed_Procedure_Initializer<Project_Parameters, _eb.Error, null> = (
    $p,
) => {
    return _easync.__create_unguaranteed_procedure({
        'execute': (on_success, on_exception) => {
            do_procedure_dict(
                $p.packages.map(($, key) => {
                    return p_api_assert_clean_package(
                        {
                            'path': _ea.set(key),
                        },
                        null,
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