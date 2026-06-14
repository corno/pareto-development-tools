import * as pt from 'pareto-core/dist/command'
import * as _pt from 'pareto-core/dist/assign'
import * as pi from 'pareto-core/dist/interface'

import * as signatures from "../../../interface/signatures"

//dependencies

export const $$: signatures.commands.npm_publish = pt.command_procedure(
    ($d, $s, $q, $c) => [
        $c['npm'].execute(
            {
                'working directory': pt.optional.literal.set($d.path),
                'args': _pt.list.nested_literal_old([
                    [
                        "publish"
                    ],
                    _pt.decide.state($d.impact, ($) => {
                        switch ($[0]) {
                            case 'dry run': return _pt.ss($, ($) => _pt.list.literal(["--dry-run"]))
                            case 'actual publish': return _pt.ss($, ($) => _pt.list.literal([
                                // "--otp",
                                // $['one time password'],
                            ]))
                            default: return _pt.au($[0])
                        }
                    }),
                ]),
            },
            ($) => ['error while running npm', $],
        )
    ]
)