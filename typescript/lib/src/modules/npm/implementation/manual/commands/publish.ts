import * as p_ from 'pareto-core/implementation/command'
import * as p_temp from 'pareto-core/implementation/transformer'

import type * as interface_ from "../../../declarations/commands.js"

//dependencies

export const $$: interface_.npm_publish = p_.command(
    ($d, $s, $q, $c) => [
        $c['npm'].execute(
            {
                'working directory': p_.literal.set($d.path),
                'args': p_temp.literal.segmented_list([
                    p_.literal.list([
                        "publish"
                    ]),
                    p_temp.from.state($d.impact).decide(
                        ($) => {
                            switch ($[0]) {
                                case 'dry run': return p_temp.ss($, ($) => p_temp.literal.list(["--dry-run"]))
                                case 'actual publish': return p_temp.ss($, ($) => p_temp.literal.list([
                                    // "--otp",
                                    // $['one time password'],
                                ]))
                                default: return p_temp.exhaustive($[0])
                            }
                        }),
                ]),
            },
            ($) => ['error while running npm', $],
        )
    ]
)