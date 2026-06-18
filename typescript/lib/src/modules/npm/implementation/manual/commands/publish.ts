import * as p_ from 'pareto-core/dist/implementation/command'
import * as p_temp from 'pareto-core/dist/implementation/transformer'

import * as interface_ from "../../../interface/commands"

//dependencies

export const $$: interface_.procedures.npm_publish = p_.command_procedure(
    ($d, $s, $q, $c) => [
        $c['npm'].execute(
            {
                'working directory': p_.literal.set($d.path),
                'args': p_temp.literal.nested_list([
                    [
                        "publish"
                    ],
                    p_temp.from.state($d.impact).decide(($) => {
                        switch ($[0]) {
                            case 'dry run': return p_temp.ss($, ($) => p_temp.literal.list(["--dry-run"]))
                            case 'actual publish': return p_temp.ss($, ($) => p_temp.literal.list([
                                // "--otp",
                                // $['one time password'],
                            ]))
                            default: return p_temp.au($[0])
                        }
                    }),
                ]),
            },
            ($) => ['error while running npm', $],
        )
    ]
)