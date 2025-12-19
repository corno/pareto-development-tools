import * as _easync from 'exupery-core-async'
import * as _ea from 'exupery-core-alg'

import * as d from "../../interface/algorithms/commands/update2latest"

import { $$ as op_flatten } from "pareto-standard-operations/dist/implementation/algorithms/operations/pure/list/flatten"
import * as t_path_to_text from "exupery-resources/dist/implementation/transformers/path/text"

export const $$: d.Procedure = _easync.create_command_procedure(
    ($p, $cr) => [
        $cr.update2latest.execute(
            {
                'args': op_flatten(_ea.list_literal([
                    _ea.list_literal([
                        t_path_to_text.Node_Path($p.path),
                    ]),
                    _ea.cc($p.what, ($) => {
                        // _ed.log_debug_message(`Updating ${$p.path} to latest`, () => {})
                        switch ($[0]) {
                            case 'dependencies': return _ea.ss($, ($) => {
                                return _ea.list_literal([`dependencies`])
                            })
                            case 'dev-dependencies': return _ea.ss($, ($) => {
                                return _ea.list_literal([`devDependencies`])
                            })
                            default: return _ea.au($[0])
                        }
                    }),
                    // $p.verbose ? _ea.list_literal([`verbose`]) : _ea.list_literal([]),
                    _ea.list_literal([`verbose`])
                ])),
            },
            ($) => ['error while running update2latest', $],
        )
    ]
)
