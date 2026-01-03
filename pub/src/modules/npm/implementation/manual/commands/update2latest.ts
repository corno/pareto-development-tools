import * as _p from 'pareto-core-command'
import * as _pt from 'pareto-core-transformer'
import * as _pi from 'pareto-core-interface'

import * as signatures from "../../../interface/signatures"

//dependencies
import * as s_path from "pareto-resources/dist/implementation/manual/schemas/path/serializers"

export const $$: signatures.commands.update2latest = _p.command_procedure(
    ($p, $cr) => [
        $cr.update2latest.execute(
            {
                'args': _pt.list.literal<_pi.List<string>>([
                    _pt.list.literal([
                        s_path.Node_Path($p.path),
                    ]),
                    _pt.cc($p.what, ($) => {
                        // _pdev.log_debug_message(`Updating ${$p.path} to latest`, () => {})
                        switch ($[0]) {
                            case 'dependencies': return _pt.ss($, ($) => {
                                return _pt.list.literal([`dependencies`])
                            })
                            case 'dev-dependencies': return _pt.ss($, ($) => {
                                return _pt.list.literal([`devDependencies`])
                            })
                            default: return _pt.au($[0])
                        }
                    }),
                    // $p.verbose ? _pt.list.literal([`verbose`]) : _pt.list.literal([]),
                    _pt.list.literal([`verbose`])
                ]).flatten(($) => $),
            },
            ($) => ['error while running update2latest', $],
        )
    ]
)
