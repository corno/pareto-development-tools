import * as _easync from 'exupery-core-async'
import * as _ei from 'exupery-core-internals'
import * as _et from 'exupery-core-types'
import * as _ed from 'exupery-core-dev'
import * as _eb from 'exupery-core-bin'
import * as _ea from 'exupery-core-alg'

import { $$ as p_api_git_remove_tracked_but_ignored } from "../../api/git-remove-tracked-but-ignored"

import * as d_eqe from "exupery-resources/dist/interface/generated/pareto/schemas/execute_query_executable/data_types/source"
import * as d_epe from "exupery-resources/dist/interface/generated/pareto/schemas/execute_procedure_executable/data_types/source"

import { Project_Parameters } from "../../../../../../interface/project_command"
import { $$ as do_procedure_dict } from "../../../../../../temp/procedure/do_unguaranteed_procedure_dictionary"

import * as t_git_extended_commit_to_text from "../../../../transformers/git_extended_commit/text"
import * as t_eqe_to_text from "../../../../transformers/execute_query_executable/text"
import * as t_git_remove_tracked_but_ignored_to_text from "../../../../transformers/git_remove_tracked_but_ignored/text"


export type Resources = {
    'queries': {
        'git': _et.Unguaranteed_Query_Primed_With_Resources<d_eqe.Parameters, d_eqe.Result, d_eqe.Error>
    }
    'procedures': {
        'git': _et.Unguaranteed_Procedure_Primed_With_Resources<d_epe.Parameters, d_epe.Error>
    }
}

export const $$: _et.Unguaranteed_Procedure<Project_Parameters, _eb.Error, Resources> = (
    $r,
) => {
    return ($p) => _easync.__create_unguaranteed_procedure({
        'execute': (on_success, on_exception) => {
            do_procedure_dict(
                $p.packages.map(($, key) => {
                    return p_api_git_remove_tracked_but_ignored($r)(
                        {
                            'path': _ea.set(key),
                        },
                    )
                }),
            ).__start(
                () => {
                    _ed.log_debug_message(`git commit for all packages succeeded`, () => { })
                    on_success()
                },
                ($) => {


                    $.map(($, key) => {
                        _ed.log_debug_message(`${key}: ${t_git_remove_tracked_but_ignored_to_text.Error($)}`, () => { })
                    })
                    on_exception({
                        'exit code': 1,
                    })
                },
            )
        }
    })
}