import * as _pc from 'pareto-core-command'
import * as _pt from 'pareto-core-transformer'
import * as _pi from 'pareto-core-interface'

import * as signatures from "../../interface/signatures"

//dependencies
import * as s_path from "exupery-resources/dist/implementation/serializers/schemas/path"

export const $$: signatures.commands.npm = _pc.create_command_procedure(
    ($p, $cr) => [
        $cr['npm'].execute(
            {
                'args': _pt.list_literal<_pi.List<string>>([
                    $p.path.transform(
                        ($) => _pt.list_literal([
                            `--prefix`,
                            s_path.Node_Path($),
                        ]),
                        () => _pt.list_literal([])
                    ),
                    _pt.cc($p.operation, ($) => {
                        switch ($[0]) {
                            case 'update': return _pt.ss($, ($) => {
                                return _pt.list_literal([
                                    `update`,
                                ])
                            })
                            case 'install': return _pt.ss($, ($) => {
                                return _pt.list_literal([
                                    `install`,
                                ])
                            })
                            default: return _pt.au($[0])
                        }
                    })
                ]).flatten(($) => $),
            },
            ($) => ['error while running npm', $],
        )
    ]
)