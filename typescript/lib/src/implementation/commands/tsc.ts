import * as p_ from 'pareto-core/implementation/command'
import * as p_t from 'pareto-core/implementation/transformer'

import type * as interface_ from "../../declarations/commands.js"

//dependencies
import * as t_path_to_text from "pareto-resources/implementation/manual/transformers/unrestricted_path/text"

export const $$: interface_.tsc = p_.command(

    // tsc
    ($d, $s, $q, $c) => [
        $c.tsc.execute(
            {
                'working directory': p_.literal.not_set(),
                'args': p_.literal.segmented_list([
                    p_.literal.list([
                        "--pretty",
                    ]),
                    p_t.from.optional($d.path).decide(
                        ($) => p_.literal.list([
                            "--project",
                            t_path_to_text.Context_Path($),
                        ]),
                        () => p_.literal.list([])
                    ),
                ]),
            },
            ($) => ['error while running tsc', $],
        )
    ]
)
