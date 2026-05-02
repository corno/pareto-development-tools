import * as _p from 'pareto-core/dist/command'
import * as _pt from 'pareto-core/dist/assign'
import * as _pi from 'pareto-core/dist/interface'

import * as signatures from "../../../interface/signatures"

//dependencies

export const $$: signatures.commands.npm_publish = _p.command_procedure(
    ($p, $cr) => [
        $cr['npm'].execute(
            {
                'working directory': _p.optional.literal.set($p.path),
                'args': _pt.list.nested_literal_old([
                    [
                        "publish"
                    ],
                    _p.decide.state($p.impact, ($) => {
                        switch ($[0]) {
                            case 'dry run': return _p.ss($, ($) => ["--dry-run"])
                            case 'actual publish': return _p.ss($, ($) => [
                                // "--otp",
                                // $['one time password'],
                            ])
                            default: return _p.au($[0])
                        }
                    }),
                ]),
            },
            ($) => ['error while running npm', $],
        )
    ]
)