import * as _easync from 'exupery-core-async'
import * as _ea from 'exupery-core-alg'
import * as _et from 'exupery-core-types'
import * as _ei from 'exupery-core-internals'

import * as d from "../../../interface/temp/queries/git_is_inside_work_tree"

import { $$ as op_flatten } from "pareto-standard-operations/dist/implementation/algorithms/operations/pure/list/flatten"


const temp_observe_behavior = <Preparation_Result, Preparation_Error, Target_Outcome, Target_Error>(
    result: _et.Data_Preparation_Result<Preparation_Result, Preparation_Error>,
    handlers: {
        success: (result: Preparation_Result) => _et.Data_Preparation_Result<Target_Outcome, Target_Error>,
        error: (error: Preparation_Error) => _et.Data_Preparation_Result<Target_Outcome, Target_Error>,
    },
): _et.Data_Preparation_Result<Target_Outcome, Target_Error> => {
    return _ei.__create_data_preparation_result<Target_Outcome, Target_Error>((onResult, onError) => {
        result.__extract_data(
            (r) => {
                handlers.success(r).__extract_data(onResult, onError)
            },
            (e) => {
                handlers.error(e).__extract_data(onResult, onError)
            }
        )
    })

}

export const $$: d.Query = _easync.create_query_procedure(($r, $p) => {
    return temp_observe_behavior(
        $r.git(
            {
                'args': op_flatten(_ea.array_literal([
                    $p.path.transform(
                        ($) => _ea.array_literal([
                            `-C`,
                            $,
                        ]),
                        () => _ea.array_literal([])
                    ),
                    _ea.array_literal([
                        `rev-parse`,
                        `--is-inside-work-tree`,
                    ])
                ])),
            },
        ),
        {
            success: ($) => {
                if ($.stdout === `true`) {
                    return _ei.data_processing.successful(true)
                } else {
                    return _ei.data_processing.failed<boolean, d.Error>(['unexpected output', $.stdout])
                }
            },
            error: ($) => _ea.cc($, ($) => {
                switch ($[0]) {
                    case 'failed to spawn': return _ea.ss($, ($) => {
                        return _ei.data_processing.failed<boolean, d.Error>(['could not run git command', {
                            'message': $.message
                        }])
                    })
                    case 'non zero exit code': return _ea.ss($, ($) => {
                        if ($['exit code'].transform(($) => $ === 128, () => false)) {
                            return _ei.data_processing.successful(false)
                        } else {
                            return _ei.data_processing.failed<boolean, d.Error>(['unexpected output', $.stderr])
                        }
                    })
                    default: return _ea.au($[0])
                }
            })
        }
    )
})
