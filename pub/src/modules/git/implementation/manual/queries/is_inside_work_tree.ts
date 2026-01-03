import * as _p from 'pareto-core-query'
import * as _pi from 'pareto-core-interface'

import * as signatures from "../../../interface/signatures"

//data types
import * as d from "../../../interface/to_be_generated/is_inside_work_tree"

//dependencies
import * as s_path from "pareto-resources/dist/implementation/manual/schemas/path/serializers"

const temp_observe_behavior = <Preparation_Result, Preparation_Error, Target_Outcome, Target_Error>(
    result: _pi.Query_Result<Preparation_Result, Preparation_Error>,
    handlers: {
        success: (result: Preparation_Result) => _pi.Query_Result<Target_Outcome, Target_Error>,
        error: (error: Preparation_Error) => _pi.Query_Result<Target_Outcome, Target_Error>,
    },
): _pi.Query_Result<Target_Outcome, Target_Error> => {
    return _p.__query_result<Target_Outcome, Target_Error>((onResult, onError) => {
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

export const $$: signatures.queries.is_inside_work_tree = _p.query_function(($p, $r) => {
    return temp_observe_behavior(
        $r.git(
            {
                'args': _p.list.literal<_pi.List<string>>([
                    $p.path.transform(
                        ($) => _p.list.literal([
                            `-C`,
                            s_path.Context_Path($),
                        ]),
                        () => _p.list.literal([])
                    ),
                    _p.list.literal([
                        `rev-parse`,
                        `--is-inside-work-tree`,
                    ])
                ]).flatten(($) => $),
            },
            ($) => $
        ),
        {
            success: ($) => $.stdout === `true`
                ? _p.__query_result((onResult, onError) => {
                    onResult(true)
                })
                : _p.__query_result<boolean, d.Error>((onResult, onError) => {
                    onResult(false)
                }),
            error: ($) => _p.cc($, ($) => {
                switch ($[0]) {
                    case 'failed to spawn': return _p.ss($, ($) => _p.__query_result<boolean, d.Error>((on_succes, on_error) => {
                            on_error(['could not run git command', {
                                'message': $.message
                            }])
                        }))
                    case 'non zero exit code': return _p.ss($, ($) => {
                        if ($['exit code'].transform(($) => $ === 128, () => false)) {
                            return _p.__query_result((onResult, onError) => {
                                onResult(false)
                            })
                        } else {
                            return _p.__query_result<boolean, d.Error>((on_succes, on_error) => {
                                on_error(['unexpected output', $.stderr])
                            })
                        }
                    })
                    default: return _p.au($[0])
                }
            })
        }
    )
})
