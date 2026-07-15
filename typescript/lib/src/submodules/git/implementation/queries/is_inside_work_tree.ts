import * as p_ from 'pareto-core/implementation/query'
import * as p_t from 'pareto-core/implementation/transformer'
import * as p_s from 'pareto-core/implementation/serializer'

import * as queries_actions from "../../../version_control_api/interface/queries.js"
import type * as query_interfaces_pareto_resources from "pareto-resources/interface/queries"

//schemas
import * as s_schema from "../../../version_control_api/interface/schemas/is_inside_work_tree.js"

//dependencies
import * as ser_path from "pareto-resources/implementation/serializers/unrestricted_path"

export const $$: p_.Query_Implementation<
    queries_actions.is_inside_work_tree,
    null,
    {
        'git': query_interfaces_pareto_resources.execute_sandboxed.query_executable
    }
> = p_.query(
    ($d, $s, $q) => p_.e.observe_behavior(
        $q.git(
            {
                'working directory': p_.literal.not_set(),
                'args': p_.literal.segmented_list([
                    p_t.from.optional($d.path).decide(
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
                ? p_.e.direct_result(true)
                : p_.e.direct_result(false),
            error: ($) => p_.decide.state($, ($): p_.Query_Result<boolean, s_schema.Error> => {
                switch ($[0]) {
                    case 'failed to spawn': return p_.option($, ($) => p_.e.direct_error(['could not run git command', {
                        'message': $.message
                    }]))
                    case 'non zero exit code': return p_.option($, ($) => p_t.from.optional($['exit code']).decide(
                        ($) => $ === 128,
                        () => false
                    )
                        ? p_.e.direct_result(false)
                        : p_.e.direct_error(['unexpected output', {
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