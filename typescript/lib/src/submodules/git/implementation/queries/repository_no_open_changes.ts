import * as p_ from 'pareto-core/implementation/query'
import * as p_t from 'pareto-core/implementation/transformer'
import p_super_query_result from 'pareto-core/implementation/query/super_query_result'

import type * as interface_ from "../../declarations/queries.js"

//data types
import * as d from "../../../version_control_api/interface/schemas/repository_no_open_changes.js"

//dependencies
import * as t_path_to_text from "pareto-resources/implementation/transformers/unrestricted_path/text"

export const $$: interface_.repository_no_open_changes = p_.query(
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
