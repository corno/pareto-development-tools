import * as pt from 'pareto-core/dist/query'
import * as pqi from 'pareto-core/dist/query_interface'


import * as signatures from "../../../interface/queries"

//data types
import * as d from "../../../interface/to_be_generated/is_inside_work_tree"

//dependencies
import * as t_path_to_text from "pareto-resources/dist/implementation/manual/transformers/unrestricted_path/text"

const temp_observe_behavior = <Preparation_Result, Preparation_Error, Target_Outcome, Target_Error>(
    result: pqi.Query_Result<Preparation_Result, Preparation_Error>,
    handlers: {
        success: (result: Preparation_Result) => pqi.Query_Result<Target_Outcome, Target_Error>,
        error: (error: Preparation_Error) => pqi.Query_Result<Target_Outcome, Target_Error>,
    },
): pqi.Query_Result<Target_Outcome, Target_Error> => pt.__query_result<Target_Outcome, Target_Error>((onResult, onError) => {
    result.__extract_data(
        (r) => {
            handlers.success(r).__extract_data(onResult, onError)
        },
        (e) => {
            handlers.error(e).__extract_data(onResult, onError)
        }
    )
})

export const $$: signatures.query_functions.is_inside_work_tree = pt.query_function(
    ($d, $s, $q) => temp_observe_behavior(
        $q.git(
            {
                'working directory': pt.optional.literal.not_set(),
                'args': pt.list.nested_literal([
                    $d.path.__decide(
                        ($) => pt.list.literal([
                            "-C",
                            t_path_to_text.Context_Path($),
                        ]),
                        () => pt.list.literal([])
                    ),
                    pt.list.literal([
                        "rev-parse",
                        "--is-inside-work-tree",
                    ])
                ]),
            },
            ($) => $
        ),
        {
            success: ($) => $.stdout.raw === "true"
                ? pt.__query_result((onResult, onError) => {
                    onResult(true)
                })
                : pt.__query_result<boolean, d.Error>((onResult, onError) => {
                    onResult(false)
                }),
            error: ($) => pt.decide.state($, ($) => {
                switch ($[0]) {
                    case 'failed to spawn': return pt.ss($, ($) => pt.__query_result<boolean, d.Error>(
                        (on_succes, on_error) => {
                            on_error(['could not run git command', {
                                'message': $.message
                            }])
                        }
                    ))
                    case 'non zero exit code': return pt.ss($, ($) => $['exit code'].__decide(
                        ($) => $ === 128,
                        () => false
                    )
                        ? pt.__query_result(
                            (onResult, onError) => {
                                onResult(false)
                            }
                        )
                        : pt.__query_result<boolean, d.Error>(
                            (on_succes, on_error) => {
                                on_error(['unexpected output', $.stderr])
                            }
                        )
                    )
                    default: return pt.au($[0])
                }
            })
        }
    ))