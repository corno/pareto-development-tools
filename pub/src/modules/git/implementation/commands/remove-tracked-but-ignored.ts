import * as _easync from 'exupery-core-async'
import * as _ea from 'exupery-core-alg'

import * as d from "../../interface/remove_tracked_but_ignored"

import { $$ as op_flatten } from "pareto-standard-operations/dist/implementation/algorithms/operations/pure/list/flatten"

export const $$: d.Procedure = _easync.create_command_procedure(
    ($p, $cr) => _easync.p.sequence([
        $cr['assert git is clean'].execute(
            {
                'path': $p.path,
            },
            ($): d.Error => _ea.cc($, ($) => {
                switch ($[0]) {
                    case 'working directory is not clean': return _ea.ss($, ($): d.Error => ['not clean', null])
                    case 'unexpected error': return _ea.ss($, ($): d.Error => ['unexpected error', $])
                    default: return _ea.au($[0])
                }
            }),
        ),
        $cr.git.execute(
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
                        `rm`,
                        `-r`,
                        `--cached`,
                        `.`
                    ])
                ]))
            },
            ($) => ['could not remove', $],
        ),
        $cr.git.execute(
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
                        `add`,
                        `--all`,
                    ])
                ]))
            },
            ($) => ['could not add', $],
        ),
    ])
)