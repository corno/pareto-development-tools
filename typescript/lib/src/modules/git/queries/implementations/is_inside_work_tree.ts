import * as p_ from 'pareto-core/implementation/query'
import * as p_t from 'pareto-core/implementation/transformer'

import * as queries_actions from "../../../version_control_api/queries/interfaces.js"
import type * as query_interfaces_pareto_resources from "pareto-execute-sandboxed/queries/interfaces"

//schemas
import * as s_schema from "../../../version_control_api/schemas/is_inside_work_tree/schema.js"

//dependencies
import * as ser_path from "pareto-execute-unrestricted-api/schemas/fs_unrestricted_path/serializers"

export const $$: p_.Query_Implementation<
    queries_actions.is_inside_work_tree,
    null,
    {
        'git': query_interfaces_pareto_resources.query_executable
    }
> = p_.query(
    (e, $s, $q, $d) => p_.e_deprecated.observe_behavior(
        $q.git(
            {
                'working directory': p_.literal.not_set(),
                'args': p_.literal.segmented_list([
                    p_t.from.optional($d.deprecated.path).decide(
                        ($) => p_.literal.list([
                            "-C",
                                ser_path.Context_Path($),
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
                ? p_.e_deprecated.direct_result(true)
                : p_.e_deprecated.direct_result(false),
            error: ($) => p_.decide.state($, ($): p_.Query_Result<boolean, s_schema.Error> => {
                switch ($[0]) {
                    case 'failed to spawn': return p_.option($, ($) => p_.e_deprecated.direct_error(['could not run git command', {
                        'message': $.message
                    }]))
                    case 'non zero exit code': return p_.option($, ($) => p_t.from.optional($['exit code']).decide(
                        ($) => $ === 128,
                        () => false
                    )
                        ? p_.e_deprecated.direct_result(false)
                        : p_.e_deprecated.direct_error(['unexpected output', {
                            'message': {
                                'lines': $.stderr.lines
                            }
                        }])
                    )
                    default: return p_.exhaustive($[0])
                }
            })
        }
    ))