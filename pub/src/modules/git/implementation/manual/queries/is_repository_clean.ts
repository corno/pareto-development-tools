import * as _pq from 'pareto-core-query'
import * as _pt from 'pareto-core-transformer'
import * as _pi from 'pareto-core-interface'

import * as signatures from "../../../interface/signatures"

//data types
import * as d from "../../../interface/to_be_generated/is_repository_clean"

//dependencies
import * as s_path from "pareto-resources/dist/implementation/manual/schemas/path/serializers"
// import * as t_path_to_path from "pareto-resources/dist/implementation/manual/schemas/path/transformers/path"

export const $$: signatures.queries.is_repository_clean = _pq.create_query_function(
    ($p, $qr) => $qr.git(
        {
            'args': _pt.list_literal<_pi.List<string>>([
                $p.path.transform(
                    ($) => _pt.list_literal([
                        `-C`,
                        s_path.Context_Path($),
                    ]),
                    () => _pt.list_literal([])
                ),
                _pt.list_literal([
                    `status`,
                    `--porcelain`,
                ])
            ]).flatten(($) => $),
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
