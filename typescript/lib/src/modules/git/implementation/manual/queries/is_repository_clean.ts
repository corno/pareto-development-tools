import * as p_ from 'pareto-core/dist/implementation/query'

import * as signatures from "../../../interface/queries"

//data types
import * as d from "../../../interface/data/is_repository_clean"

//dependencies
import * as t_path_to_text from "pareto-resources/dist/implementation/manual/transformers/unrestricted_path/text"

export const $$: signatures.query_functions.is_repository_clean = p_.query_function(
    ($d, $s, $q) => $q.git(
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
