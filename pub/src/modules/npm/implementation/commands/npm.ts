import * as _easync from 'exupery-core-async'
import * as _ea from 'exupery-core-alg'
import * as _et from 'exupery-core-types'

import * as signatures from "../../interface/signatures"

//dependencies
import * as s_path from "exupery-resources/dist/implementation/serializers/schemas/path"

export const $$: signatures.commands.npm = _easync.create_command_procedure(
    ($p, $cr) => [
        $cr['npm'].execute(
            {
                'args': _ea.list_literal<_et.List<string>>([
                    $p.path.transform(
                        ($) => _ea.list_literal([
                            `--prefix`,
                            s_path.Node_Path($),
                        ]),
                        () => _ea.list_literal([])
                    ),
                    _ea.cc($p.operation, ($) => {
                        switch ($[0]) {
                            case 'update': return _ea.ss($, ($) => {
                                return _ea.list_literal([
                                    `update`,
                                ])
                            })
                            case 'install': return _ea.ss($, ($) => {
                                return _ea.list_literal([
                                    `install`,
                                ])
                            })
                            default: return _ea.au($[0])
                        }
                    })
                ]).flatten(($) => $),
            },
            ($) => ['error while running npm', $],
        )
    ]
)