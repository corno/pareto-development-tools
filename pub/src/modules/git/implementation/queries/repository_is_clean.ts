import * as _easync from 'exupery-core-async'
import * as _ea from 'exupery-core-alg'

import { $$ as op_flatten } from "pareto-standard-operations/dist/implementation/operations/pure/list/flatten"

import * as d from "../../interface/algorithms/queries/git_is_clean"
import * as t_path_to_text from "exupery-resources/dist/implementation/transformers/path/text"
import * as t_path_to_path from "exupery-resources/dist/implementation/transformers/path/path"

export const $$: d.Query = _easync.create_query_function(
    ($p, $qr) => $qr.git(
        {
            'args': op_flatten(_ea.list_literal([
                $p.path.transform(
                    ($) => _ea.list_literal([
                        `-C`,
                        t_path_to_text.Context_Path($),
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
