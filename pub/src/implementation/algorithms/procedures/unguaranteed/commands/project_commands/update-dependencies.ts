import * as _easync from 'exupery-core-async'
import * as _ei from 'exupery-core-internals'
import * as _et from 'exupery-core-types'
import * as _ed from 'exupery-core-dev'
import * as _eb from 'exupery-core-bin'
import * as _ea from 'exupery-core-alg'

import { $$ as p_api_update_dependencies } from "../../api/update-dependencies"

import { Project_Parameters } from "../../../../../../interface/project_command"

import { $$ as do_procedure_dict } from "../../../../../../temp/procedure/do_unguaranteed_procedure_dictionary"

import { $$ as op_dictionary_to_list } from "pareto-standard-operations/dist/implementation/algorithms/operations/impure/dictionary/to_list_sorted_by_insertion"
import { $$ as op_join } from "pareto-standard-operations/dist/implementation/algorithms/operations/pure/text/join_list_of_texts"

import * as d_epe from "exupery-resources/dist/interface/generated/pareto/schemas/execute_procedure_executable/data_types/source"
import * as d_write_to_stderr from "exupery-resources/dist/interface/generated/pareto/schemas/write_to_stderr/data_types/source"
import * as d from "../../../../../../interface/temp/project_update_dependencies"

import * as t_ud_error_to_text from "../../../../transformers/update_dependencies/text"

const execute_and_write_errors_to_stderr_and_set_exit_code_to_1 = (
    procedure: _et.Unguaranteed_Procedure_Promise<string>,
    p_write_to_stderr: _et.Guaranteed_Procedure_Primed_With_Resources<d_write_to_stderr.Parameters>
): _et.Unguaranteed_Procedure_Promise<_eb.Error> => {
    return _easync.__create_unguaranteed_procedure({
        'execute': (on_success, on_exception) => {
            procedure.__start(
                on_success,
                ($) => {
                    p_write_to_stderr($).__start(
                        () => {
                            on_exception({
                                'exit code': 1,
                            })
                        },
                    )
                }
            )
        }
    })
}


export const $$: _et.Unguaranteed_Procedure<Project_Parameters, _eb.Error, d.Resources> = (
    $r,
) => {
    return ($p) => execute_and_write_errors_to_stderr_and_set_exit_code_to_1(
        do_procedure_dict(
            $p.packages.map(($, key) => {
                return p_api_update_dependencies($r)(
                    {
                        'path': key,
                    },
                )
            }),
        ).map_error(($) => {
            // const t_ud_error_to_string = ($: d_ud.Error): string => {
            //     return _ea.cc($, ($): string => {
            //         switch ($[0]) {
            //             case 'error building pub': return _ea.ss($, ($) => t_utd_to_string($))
            //             case 'error building test': return _ea.ss($, ($) => t_utd_to_string($))
            //             default: return _ea.au($[0])
            //         }
            //     })
            // }
            const data: string = op_join(
                op_dictionary_to_list(
                    $.map(($, key): string => {
                        return `${key}` + t_ud_error_to_text.Error($)
                    })

                ).map(($) => $.value)
            )
            return data
        }),
        $r.procedures['write to stderr'],
    )
}