import * as _pc from 'pareto-core-command'
import * as _pt from 'pareto-core-transformer'
import * as _pi from 'pareto-core-interface'

import * as signatures from "../../../interface/signatures"

//dependencies
import * as s_path from "exupery-resources/dist/implementation/serializers/schemas/path"

export const $$: signatures.commands.update2latest = _pc.create_command_procedure(
    ($p, $cr) => [
        $cr.update2latest.execute(
            {
                'args': _pt.list_literal<_pi.List<string>>([
                    _pt.list_literal([
                        s_path.Node_Path($p.path),
                    ]),
                    _pt.cc($p.what, ($) => {
                        // _pdev.log_debug_message(`Updating ${$p.path} to latest`, () => {})
                        switch ($[0]) {
                            case 'dependencies': return _pt.ss($, ($) => {
                                return _pt.list_literal([`dependencies`])
                            })
                            case 'dev-dependencies': return _pt.ss($, ($) => {
                                return _pt.list_literal([`devDependencies`])
                            })
                            default: return _pt.au($[0])
                        }
                    }),
                    // $p.verbose ? _pt.list_literal([`verbose`]) : _pt.list_literal([]),
                    _pt.list_literal([`verbose`])
                ]).flatten(($) => $),
            },
            ($) => ['error while running update2latest', $],
        )
    ]
)
