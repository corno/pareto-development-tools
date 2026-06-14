import * as p_ from 'pareto-core/dist/query/implementation'
import * as p_t from 'pareto-core/dist/assign'

import * as signatures from "../../../interface/queries"

//data types
import * as d from "../../../interface/to_be_generated/is_repository_clean"

//dependencies
import * as t_path_to_text from "pareto-resources/dist/implementation/manual/transformers/unrestricted_path/text"

export const $$: signatures.query_functions.is_repository_clean = p_.query_function(
    ($d, $s, $q) => $q.git(
        {
            'working directory': p_t.optional.literal.not_set(),
            'args': p_t.list.nested_literal_old([
                $d.path.__decide(
                    ($) => p_t.list.literal([
                        "-C",
                        t_path_to_text.Context_Path($),
                    ]),
                    () => p_t.list.literal([])
                ),
                p_t.list.literal([
                    "status",
                    "--porcelain",
                ])
            ]),
        },
        ($) => $,
    ).transform<boolean>(
        ($) => $.stdout.raw === ""
    ).rework_error_temp(
        ($current) => $q['is inside git work tree'](
            {
                'path': $d.path
            },
            ($) => $
        ).transform<d.Error>(
            ($) => {
                return $
                    ? ['could not determine git status', $current]
                    : ['not a git repository', null]
            }
        ),
        ($): d.Error => ['unknown issue', $]
    )
)
