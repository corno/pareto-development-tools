import * as _easync from 'exupery-core-async'
import * as _ea from 'exupery-core-alg'

import * as d from "../../interface/remove_tracked_but_ignored"

import { $$ as op_flatten } from "pareto-standard-operations/dist/implementation/algorithms/operations/pure/list/flatten"

export const $$: d.Procedure = _easync.create_command_procedure(
    ($r, $p) => _easync.p.sequence([
        $r.commands['assert git is clean'].execute.direct(
            ($): d.Error => _ea.cc($, ($) => {
                switch ($[0]) {
                    case 'working directory is not clean': return _ea.ss($, ($): d.Error => ['not clean', null])
                    case 'unexpected error': return _ea.ss($, ($): d.Error => ['unexpected error', $])
                    default: return _ea.au($[0])
                }
            }),
            {
                'path': $p.path,
            },
        ),
        $r.commands.git.execute.direct(
            ($) => ['could not remove', $],
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
                        `rm`,
                        `-r`,
                        `--cached`,
                        `.`
                    ])
                ]))
            },
        ),
        $r.commands.git.execute.direct(
            ($) => ['could not add', $],
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
                        `add`,
                        `--all`,
                    ])
                ]))
            },
        ),
    ])
)