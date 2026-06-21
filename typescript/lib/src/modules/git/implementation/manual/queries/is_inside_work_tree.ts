import * as p_ from 'pareto-core/dist/implementation/query'


import * as interface_ from "../../../interface/queries"

//dependencies
import * as t_path_to_text from "pareto-resources/dist/implementation/manual/transformers/unrestricted_path/text"

export const $$: interface_.query_functions.is_inside_work_tree = p_.query_function(
    ($d, $s, $q) => p_.e.observe_behavior(
        $q.git(
            {
                'working directory': p_.literal.not_set(),
                'args': p_.literal.segmented_list([
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
                ? p_.e.direct_result(true)
                : p_.e.direct_result(false),
            error: ($) => p_.decide.state($, ($) => {
                switch ($[0]) {
                    case 'failed to spawn': return p_.ss($, ($) => p_.e.direct_error(['could not run git command', {
                        'message': $.message
                    }]))
                    case 'non zero exit code': return p_.ss($, ($) => $['exit code'].__decide(
                        ($) => $ === 128,
                        () => false
                    )
                        ? p_.e.direct_result(false)
                        : p_.e.direct_error(['unexpected output', $.stderr])
                    )
                    default: return p_.au($[0])
                }
            })
        }
    ))