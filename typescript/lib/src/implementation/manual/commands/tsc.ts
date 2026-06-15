import * as p_ from 'pareto-core/dist/command/implementation'
import * as p_t from 'pareto-core/dist/assign'

import * as signatures from "../../../interface/commands"

//dependencies
import * as t_path_to_text from "pareto-resources/dist/implementation/manual/transformers/unrestricted_path/text"

export const $$: signatures.procedures.tsc = p_.command_procedure(

    // tsc
    ($d, $s, $q, $c) => [
        $c.tsc.execute(
            {
                'working directory': p_.literal.not_set(),
                'args': p_t.literal.nested_list([
                    $d.path.__decide(
                        ($) => p_.literal.list([
                            "--project",
                            t_path_to_text.Context_Path($),
                        ]),
                        () => p_t.literal.list([])
                    ),
                    p_t.literal.list([
                        "--pretty",
                    ]),
                ]),
            },
            ($) => ['error while running tsc', $],
        )
    ]
)
