import * as p_ from 'pareto-core/dist/command/implementation'
import * as p_t from 'pareto-core/dist/assign'

import * as signatures from "../../../interface/signatures"

//dependencies

export const $$: signatures.commands.npm_publish = p_.command_procedure(
    ($d, $s, $q, $c) => [
        $c['npm'].execute(
            {
                'working directory': p_.literal.set($d.path),
                'args': p_t.literal.nested_list([
                    [
                        "publish"
                    ],
                    p_t.decide.state($d.impact, ($) => {
                        switch ($[0]) {
                            case 'dry run': return p_t.ss($, ($) => p_t.literal.list(["--dry-run"]))
                            case 'actual publish': return p_t.ss($, ($) => p_t.literal.list([
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