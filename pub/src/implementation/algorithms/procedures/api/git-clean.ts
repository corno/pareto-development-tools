import * as _easync from 'exupery-core-async'
import * as _ea from 'exupery-core-alg'

import * as d from "../../../../interface/temp/procedures/commands/git_clean"

import { $$ as op_flatten } from "pareto-standard-operations/dist/implementation/algorithms/operations/pure/list/flatten"

export const $$: d.Procedure = _easync.create_command_procedure(
    ($r, $p) => $r.commands.git.execute.direct(
        ($) => ['unexpected error', $],
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
                    `clean`,
                    `--force`,
                    `-d`, // remove whole directories
                    `-X`, // remove only ignored files (not the capital X as opposed to -x which removes all untracked files, including unignored ones)

                ])
            ])),
        },
    )
)