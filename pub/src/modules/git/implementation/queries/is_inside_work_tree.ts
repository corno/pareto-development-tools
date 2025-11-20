import * as _easync from 'exupery-core-async'
import * as _ea from 'exupery-core-alg'
import * as _et from 'exupery-core-types'
import * as _ei from 'exupery-core-internals'

import * as d from "../../interface/queries/git_is_inside_work_tree"

import { $$ as op_flatten } from "pareto-standard-operations/dist/implementation/algorithms/operations/pure/list/flatten"


const temp_observe_behavior = <Preparation_Result, Preparation_Error, Target_Outcome, Target_Error>(
    result: _et.Query_Result<Preparation_Result, Preparation_Error>,
    handlers: {
        success: (result: Preparation_Result) => _et.Query_Result<Target_Outcome, Target_Error>,
        error: (error: Preparation_Error) => _et.Query_Result<Target_Outcome, Target_Error>,
    },
): _et.Query_Result<Target_Outcome, Target_Error> => {
    return _ei.__create_query_result<Target_Outcome, Target_Error>((onResult, onError) => {
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

export const $$: d.Query = _easync.create_query_procedure(($p, $r) => {
    return temp_observe_behavior(
        $r.git(
            {
                'args': op_flatten(_ea.list_literal([
                    $p.path.transform(
                        ($) => _ea.list_literal([
                            `-C`,
                            $,
                        ]),
                        () => _ea.list_literal([])
                    ),
                    _ea.list_literal([
                        `rev-parse`,
                        `--is-inside-work-tree`,
                    ])
                ])),
            },
            ($) => $
        ),
        {
            success: ($) => {
                if ($.stdout === `true`) {
                    return _ei.__create_query_result((onResult, onError) => {
                        onResult(true)
                    })
                } else {
                    return _ei.__create_query_result<boolean, d.Error>((onResult, onError) => {
                        onResult(false)
                    })
                }
            },
            error: ($) => _ea.cc($, ($) => {
                switch ($[0]) {
                    case 'failed to spawn': return _ea.ss($, ($) => {
                        return _ei.__create_query_result<boolean, d.Error>((on_succes, on_error) => {
                            on_error(['could not run git command', {
                            'message': $.message
                        }])
                        })
                    })
                    case 'non zero exit code': return _ea.ss($, ($) => {
                        if ($['exit code'].transform(($) => $ === 128, () => false)) {
                            return _ei.__create_query_result((onResult, onError) => {
                                onResult(false)
                            })
                        } else {
                            return _ei.__create_query_result<boolean, d.Error>((on_succes, on_error) => {
                                on_error(['unexpected output', $.stderr])
                            })
                        }
                    })
                    default: return _ea.au($[0])
                }
            })
        }
    )
})
