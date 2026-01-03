import * as _p from 'pareto-core-command'
import * as _pt from 'pareto-core-transformer'
import * as _pi from 'pareto-core-interface'

import * as signatures from "../../../interface/signatures"

//dependencies
import * as s_path from "pareto-resources/dist/implementation/manual/schemas/path/serializers"

export const $$: signatures.commands.npm = _p.command_procedure(
    ($p, $cr) => [
        $cr['npm'].execute(
            {
                'args': _pt.list.literal<_pi.List<string>>([
                    $p.path.transform(
                        ($) => _pt.list.literal([
                            `--prefix`,
                            s_path.Node_Path($),
                        ]),
                        () => _pt.list.literal([])
                    ),
                    _pt.cc($p.operation, ($) => {
                        switch ($[0]) {
                            case 'update': return _pt.ss($, ($) => _pt.list.literal([
                                `update`,
                            ]))
                            case 'install': return _pt.ss($, ($) => _pt.list.literal([
                                `install`,
                            ]))
                            default: return _pt.au($[0])
                        }
                    })
                ]).flatten(($) => $),
            },
            ($) => ['error while running npm', $],
        )
    ]
)