import * as _easync from 'exupery-core-async'
import * as _ea from 'exupery-core-alg'

import * as d from "../../interface/clean"

import { $$ as op_flatten } from "pareto-standard-operations/dist/implementation/algorithms/operations/pure/list/flatten"

export const $$: d.Procedure = _easync.create_command_procedure(
    ($p, $cr) => $cr.git.execute(
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
                    `clean`,
                    `--force`,
                    `-d`, // remove whole directories
                    `-X`, // remove only ignored files (not the capital X as opposed to -x which removes all untracked files, including unignored ones)

                ])
            ])),
        },
        ($) => ['unexpected error', $],
    )
)