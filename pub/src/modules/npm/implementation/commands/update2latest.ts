import * as _easync from 'exupery-core-async'
import * as _ea from 'exupery-core-alg'
import * as _et from 'exupery-core-types'

import * as signatures from "../../interface/signatures"

//dependencies
import * as s_path from "exupery-resources/dist/implementation/serializers/schemas/path"

export const $$: signatures.commands.update2latest = _easync.create_command_procedure(
    ($p, $cr) => [
        $cr.update2latest.execute(
            {
                'args': _ea.list_literal<_et.List<string>>([
                    _ea.list_literal([
                        s_path.Node_Path($p.path),
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
                ]).flatten(($) => $),
            },
            ($) => ['error while running update2latest', $],
        )
    ]
)
