import * as p_ from 'pareto-core/dist/implementation/command'

import * as interface_ from "../../../interface/commands"

//dependencies
import * as t_path_to_text from "pareto-resources/dist/implementation/manual/transformers/unrestricted_path/text"

export const $$: interface_.procedures.tsc = p_.command_procedure(

    // tsc
    ($d, $s, $q, $c) => [
        $c.tsc.execute(
            {
                'working directory': p_.literal.not_set(),
                'args': p_.literal.segmented_list([
                    p_.literal.list([
                        "--pretty",
                    ]),
                    $d.path.__decide(
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
