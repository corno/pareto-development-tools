import * as _easync from 'exupery-core-async'
import * as _ea from 'exupery-core-alg'

import * as d from "../../../../interface/temp/procedures/commands/update2latest"

import { $$ as op_flatten } from "pareto-standard-operations/dist/implementation/algorithms/operations/pure/list/flatten"

export const $$: d.Procedure = _easync.create_command_procedure(
    ($r, $p) => $r.commands.update2latest.execute.direct(
        ($) => ['error while running update2latest', $],
        {
            'args': op_flatten(_ea.array_literal([
                _ea.array_literal([
                    $p.path,
                ]),
                _ea.cc($p.what, ($) => {
                    // _ed.log_debug_message(`Updating ${$p.path} to latest`, () => {})
                    switch ($[0]) {
                        case 'dependencies': return _ea.ss($, ($) => {
                            return _ea.array_literal([`dependencies`])
                        })
                        case 'dev-dependencies': return _ea.ss($, ($) => {
                            return _ea.array_literal([`devDependencies`])
                        })
                        default: return _ea.au($[0])
                    }
                }),
                // $p.verbose ? _ea.array_literal([`verbose`]) : _ea.array_literal([]),
                _ea.array_literal([`verbose`])
            ])),
        },
    )
)
