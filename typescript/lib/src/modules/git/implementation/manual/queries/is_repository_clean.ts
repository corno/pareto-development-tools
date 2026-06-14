import query_function from 'pareto-core/dist/__internals/async/query_function'
import * as _p from 'pareto-core/dist/assign'
import * as _pi from 'pareto-core/dist/interface'

import * as signatures from "../../../interface/signatures"

//data types
import * as d from "../../../interface/to_be_generated/is_repository_clean"

//dependencies
import * as t_path_to_text from "pareto-resources/dist/implementation/manual/transformers/unrestricted_path/text"

export const $$: signatures.queries.is_repository_clean = query_function(
    ($d, $s, $q) => $q.git(
        {
            'working directory': _p.optional.literal.not_set(),
            'args': _p.list.nested_literal_old([
                $d.path.__decide(
                    ($) => _p.list.literal([
                        "-C",
                        t_path_to_text.Context_Path($),
                    ]),
                    () => _p.list.literal([])
                ),
                _p.list.literal([
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
