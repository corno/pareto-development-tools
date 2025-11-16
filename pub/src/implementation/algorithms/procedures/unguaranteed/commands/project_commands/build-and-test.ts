import * as _easync from 'exupery-core-async'
import * as _ei from 'exupery-core-internals'
import * as _et from 'exupery-core-types'
import * as _ed from 'exupery-core-dev'
import * as _eb from 'exupery-core-bin'
import * as _ea from 'exupery-core-alg'

import * as d_espe from "exupery-resources/dist/interface/generated/pareto/schemas/execute_smelly_procedure_executable/data_types/source"
import * as d_epe from "exupery-resources/dist/interface/generated/pareto/schemas/execute_procedure_executable/data_types/source"

import * as d_write_to_stderr from "exupery-resources/dist/interface/generated/pareto/schemas/write_to_stderr/data_types/source"
import { Project_Parameters } from "../../../../../../interface/project_command"

import { $$ as p_api_build_and_test } from "../../api/build_and_test"
import { $$ as do_procedure_dict } from "../../../../../../temp/procedure/do_unguaranteed_procedure_dictionary"
import { $$ as op_dictionary_to_list } from "pareto-standard-operations/dist/implementation/algorithms/operations/impure/dictionary/to_list_sorted_by_insertion"
import { $$ as op_join } from "pareto-standard-operations/dist/implementation/algorithms/operations/pure/text/join_list_of_texts"

import * as t_build_and_test_to_text from "../../../../transformers/build_and_test/text"


export type Resources = {
    'procedures': {
        'tsc': _et.Unguaranteed_Procedure_Primed_With_Resources<d_espe.Parameters, d_espe.Error>
        'write to stderr': _et.Guaranteed_Procedure_Primed_With_Resources<d_write_to_stderr.Parameters>
        'node': _et.Unguaranteed_Procedure_Primed_With_Resources<d_epe.Parameters, d_epe.Error>
    }
}

export const $$: _et.Unguaranteed_Procedure<Project_Parameters, _eb.Error, Resources> = (
    $r,
) => {
    return ($p) => _easync.__create_unguaranteed_procedure({
        'execute': (on_success, on_exception) => {
            do_procedure_dict(
                $p.packages.map(($, key) => {
                    return p_api_build_and_test($r)(
                        {
                            'path': key,
                        },
                    )
                }),
            ).__start(
                on_success,
                ($) => {

                    const data: string = op_join(
                        op_dictionary_to_list(
                            $.map(($, key): string => {
                                return `${key}:\n` + t_build_and_test_to_text.Error($)
                            })

                        ).map(($) => $.value)
                    )
                    $r.procedures['write to stderr'](data).__start(
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