import * as _easync from 'exupery-core-async'
import * as _ei from 'exupery-core-internals'
import * as _et from 'exupery-core-types'
import * as _ed from 'exupery-core-dev'
import * as _eb from 'exupery-core-bin'
import * as _ea from 'exupery-core-alg'

import * as d_eqe from "exupery-resources/dist/interface/generated/pareto/schemas/execute_query_executable/data_types/source"
import * as d_epe from "exupery-resources/dist/interface/generated/pareto/schemas/execute_procedure_executable/data_types/source"
import * as d_e_smelly_pe from "exupery-resources/dist/interface/generated/pareto/schemas/execute_smelly_procedure_executable/data_types/source"
import * as d_log from "exupery-resources/dist/interface/generated/pareto/schemas/log/data_types/source"
import * as d_write_to_stderr from "exupery-resources/dist/interface/generated/pareto/schemas/write_to_stderr/data_types/source"
import * as d_read_directory from "exupery-resources/dist/interface/generated/pareto/schemas/read_directory/data_types/source"

import { $$ as op_remove_first } from "pareto-standard-operations/dist/implementation/algorithms/operations/impure/list/pop_first_element"
import { $$ as op_to_list } from "pareto-standard-operations/dist/implementation/algorithms/operations/impure/dictionary/to_list_sorted_by_insertion"
import { $$ as op_flatten } from "pareto-standard-operations/dist/implementation/algorithms/operations/pure/list/flatten"

import { $$ as p_command_assert_clean } from "./commands/assert-clean"
import { $$ as p_command_project } from "./commands/project"

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

export type Resources = {
    'queries': {
        'git': _et.Unguaranteed_Query_Primed_With_Resources<d_eqe.Parameters, d_eqe.Result, d_eqe.Error>
        'read directory': _et.Unguaranteed_Query_Primed_With_Resources<d_read_directory.Parameters, d_read_directory.Result, d_read_directory.Error>
    },
    'procedures': {
        'git': _et.Unguaranteed_Procedure_Primed_With_Resources<d_epe.Parameters, d_epe.Error>
        'log': _et.Guaranteed_Procedure_Primed_With_Resources<d_log.Parameters>
        'node': _et.Unguaranteed_Procedure_Primed_With_Resources<d_epe.Parameters, d_epe.Error>
        'npm': _et.Unguaranteed_Procedure_Primed_With_Resources<d_epe.Parameters, d_epe.Error>
        'tsc': _et.Unguaranteed_Procedure_Primed_With_Resources<d_e_smelly_pe.Parameters, d_e_smelly_pe.Error>
        'update2latest': _et.Unguaranteed_Procedure_Primed_With_Resources<d_epe.Parameters, d_epe.Error>
        'write to stderr': _et.Guaranteed_Procedure_Primed_With_Resources<d_write_to_stderr.Parameters>

    }
}

export const $$: _et.Unguaranteed_Procedure<_eb.Parameters, _eb.Error, Resources> = (
    $r,
) => {
    return ($p) => _easync.__create_unguaranteed_procedure({
        'execute': (on_success, on_exception) => {
            const commands: _et.Dictionary<_et.Unguaranteed_Procedure<_eb.Parameters, _eb.Error, Resources>> = _ea.dictionary_literal({
                'assert-clean': p_command_assert_clean,
                'project': p_command_project,
            })
            op_remove_first($p.arguments).transform(
                ($) => {
                    const rest = $.rest
                    commands.__get_entry($.element).transform(
                        ($) => {
                            $($r)(
                                {
                                    'arguments': rest
                                },
                            ).__start(
                                on_success,
                                on_exception,
                            )
                        },
                        log_and_exit(
                            on_exception,
                            op_flatten(_ea.array_literal([
                                _ea.array_literal([`unknown command, select from: `]),
                                op_to_list(commands).map(($) => `- ${$.key}`)
                            ])),
                            $r.procedures.log
                        )
                    )

                },
                log_and_exit(
                    on_exception,
                    op_flatten(_ea.array_literal([
                        _ea.array_literal([`please provide a command to run: `]),
                        op_to_list(commands).map(($) => `- ${$.key}`)
                    ])),
                    $r.procedures.log,
                )
            )
        }
    })
}