import * as p_ from 'pareto-core/dist/command/implementation'
import * as p_t from 'pareto-core/dist/assign'

import * as signatures from "../../../interface/signatures"

//dependencies

export const $$: signatures.commands.npm_publish = p_.command_procedure(
    ($d, $s, $q, $c) => [
        $c['npm'].execute(
            {
                'working directory': p_.optional.literal.set($d.path),
                'args': p_t.list.nested_literal_old([
                    [
                        "publish"
                    ],
                    p_t.decide.state($d.impact, ($) => {
                        switch ($[0]) {
                            case 'dry run': return p_t.ss($, ($) => p_t.list.literal(["--dry-run"]))
                            case 'actual publish': return p_t.ss($, ($) => p_t.list.literal([
                                // "--otp",
                                // $['one time password'],
                            ]))
                            default: return p_t.au($[0])
                        }
                    }),
                ]),
            },
            ($) => ['error while running npm', $],
        )
    ]
)