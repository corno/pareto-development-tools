import * as _easync from 'exupery-core-async'
import * as _ea from 'exupery-core-alg'

import { $$ as op_flatten } from "pareto-standard-operations/dist/implementation/algorithms/operations/pure/list/flatten"

import * as d from "../../../../interface/temp/queries/git_is_clean"


export const $$: d.Query = _easync.create_query_procedure(
    ($r, $p) => $r.git(
        {
            'args': op_flatten(_ea.array_literal([
                $p.path.transform(
                    ($) => _ea.array_literal([
                        `-C`,
                        $,
                    ]),
                    () => _ea.array_literal([])
                ),
                _ea.array_literal([
                    `status`,
                    `--porcelain`,
                ])
            ])),
        },
    ).transform<boolean>(
        ($) => $.stdout === ``
    ).rework_error_temp(
        ($current) => $r['is inside git work tree'](
            {
                'path': $p.path
            },
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
