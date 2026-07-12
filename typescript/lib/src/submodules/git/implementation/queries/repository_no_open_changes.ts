import * as p_ from 'pareto-core/implementation/query'
import * as p_t from 'pareto-core/implementation/transformer'
import p_super_query_result from 'pareto-core/implementation/query/super_query_result'

import * as queries_actions from "../../../version_control_api/interface/queries.js"
import type * as query_interfaces_pareto_resources from "pareto-resources/interface/queries"

//schemas
import * as d from "../../../version_control_api/interface/schemas/repository_no_open_changes.js"

//dependencies
import * as t_path_to_text from "pareto-resources/implementation/transformers/unrestricted_path/text"

export const $$: p_.Query_Implementation<
    queries_actions.repository_no_open_changes,
    null,
    {
        'is inside work tree': queries_actions.is_inside_work_tree,
        'git': query_interfaces_pareto_resources.execute_sandboxed.query_executable
    }
> = p_.query(
    ($d, $s, $q) =>  p_super_query_result($q.git(
        {
            'working directory': p_.literal.not_set(),
            'args': p_.literal.segmented_list([
                p_t.from.optional($d.path).decide(
                    ($) => p_.literal.list([
                        "-C",
                        t_path_to_text.Context_Path($),
                    ]),
                    () => p_.literal.list([])
                ),
                p_.literal.list([
                    "status",
                    "--porcelain",
                ])
            ]),
        },
        ($) => $,
    )).transform<boolean>(
        ($) => $.stdout.raw === ""
    ).rework_error_temp(
        ($current) =>  p_super_query_result($q['is inside work tree'](
            {
                'path': $d.path
            },
            ($) => $
        )).transform<d.Error>(
            ($) => {
                return $
                    ? ['could not determine status', $current]
                    : ['not a repository', null]
            }
        ),
        ($): d.Error => ['unknown issue', $]
    )
)
