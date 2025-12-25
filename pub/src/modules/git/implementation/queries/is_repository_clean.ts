import * as _easync from 'exupery-core-async'
import * as _ea from 'exupery-core-alg'

import * as signatures from "../../interface/signatures"

//data types
import * as d from "../../interface/to_be_generated/is_repository_clean"

//dependencies
import { $$ as op_flatten } from "pareto-standard-operations/dist/implementation/operations/pure/list/flatten"
import * as s_path from "exupery-resources/dist/implementation/serializers/schemas/path"
// import * as t_path_to_path from "exupery-resources/dist/implementation/transformers/schemas/path/path"

export const $$: signatures.queries.is_repository_clean = _easync.create_query_function(
    ($p, $qr) => $qr.git(
        {
            'args': op_flatten(_ea.list_literal([
                $p.path.transform(
                    ($) => _ea.list_literal([
                        `-C`,
                        s_path.Context_Path($),
                    ]),
                    () => _ea.list_literal([])
                ),
                _ea.list_literal([
                    `status`,
                    `--porcelain`,
                ])
            ])),
        },
        ($) => $,
    ).transform_result<boolean>(
        ($) => $.stdout === ``
    ).rework_error_temp(
        ($current) => $qr['is inside git work tree'](
            {
                'path': $p.path
            },
            ($) => $
        ).transform_result<d.Error>(
            ($) => {
                return $
                    ? ['could not determine git status', $current]
                    : ['not a git repository', null]
            }
        ),
        ($): d.Error => ['unknown issue', $]
    )
)
