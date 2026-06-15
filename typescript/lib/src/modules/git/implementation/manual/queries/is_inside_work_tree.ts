import * as p_ from 'pareto-core/dist/implementation/query'


import * as signatures from "../../../interface/queries"

//data types
import * as d from "../../../interface/data/is_inside_work_tree"

//dependencies
import * as t_path_to_text from "pareto-resources/dist/implementation/manual/transformers/unrestricted_path/text"

const temp_observe_behavior = <Preparation_Result, Preparation_Error, Target_Outcome, Target_Error>(
    result: p_.Query_Result<Preparation_Result, Preparation_Error>,
    handlers: {
        success: (result: Preparation_Result) => p_.Query_Result<Target_Outcome, Target_Error>,
        error: (error: Preparation_Error) => p_.Query_Result<Target_Outcome, Target_Error>,
    },
): p_.Query_Result<Target_Outcome, Target_Error> => p_.query_result<Target_Outcome, Target_Error>((onResult, onError) => {
    result.__extract_data(
        (r) => {
            handlers.success(r).__extract_data(onResult, onError)
        },
        (e) => {
            handlers.error(e).__extract_data(onResult, onError)
        }
    )
})

export const $$: signatures.query_functions.is_inside_work_tree = p_.query_function(
    ($d, $s, $q) => temp_observe_behavior(
        $q.git(
            {
                'working directory': p_.literal.not_set(),
                'args': p_.literal.nested_list([
                    $d.path.__decide(
                        ($) => p_.literal.list([
                            "-C",
                            t_path_to_text.Context_Path($),
                        ]),
                        () => p_.literal.list([])
                    ),
                    p_.literal.list([
                        "rev-parse",
                        "--is-inside-work-tree",
                    ])
                ]),
            },
            ($) => $
        ),
        {
            success: ($) => $.stdout.raw === "true"
                ? p_.query_result((onResult, onError) => {
                    onResult(true)
                })
                : p_.query_result<boolean, d.Error>((onResult, onError) => {
                    onResult(false)
                }),
            error: ($) => p_.decide.state($, ($) => {
                switch ($[0]) {
                    case 'failed to spawn': return p_.ss($, ($) => p_.query_result<boolean, d.Error>(
                        (on_succes, on_error) => {
                            on_error(['could not run git command', {
                                'message': $.message
                            }])
                        }
                    ))
                    case 'non zero exit code': return p_.ss($, ($) => $['exit code'].__decide(
                        ($) => $ === 128,
                        () => false
                    )
                        ? p_.query_result(
                            (onResult, onError) => {
                                onResult(false)
                            }
                        )
                        : p_.query_result<boolean, d.Error>(
                            (on_succes, on_error) => {
                                on_error(['unexpected output', $.stderr])
                            }
                        )
                    )
                    default: return p_.au($[0])
                }
            })
        }
    ))