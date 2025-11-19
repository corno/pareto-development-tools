import * as _easync from 'exupery-core-async'
import * as _ea from 'exupery-core-alg'

import { $$ as op_flatten } from "pareto-standard-operations/dist/implementation/algorithms/operations/pure/list/flatten"

import * as d from "../../interface/queries/git_is_clean"


export const $$: d.Query = _easync.create_query_procedure(
    ($p, $qr) => $qr.git(
        {
            'args': op_flatten(_ea.list_literal([
                $p.path.transform(
                    ($) => _ea.list_literal([
                        `-C`,
                        $,
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
    ).transform<boolean>(
        ($) => $.stdout === ``
    ).rework_error_temp(
        ($current) => $qr['is inside git work tree'](
            {
                'path': $p.path
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
