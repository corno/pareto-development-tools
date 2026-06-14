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
                'working directory': p_.optional.literal.not_set(),
                'args': p_t.list.nested_literal_old([
                    $d.path.__decide(
                        ($) => p_.list.literal([
                            "--project",
                            t_path_to_text.Context_Path($),
                        ]),
                        () => p_t.list.literal([])
                    ),
                    p_t.list.literal([
                        "--pretty",
                    ]),
                ]),
            },
            ($) => ['error while running tsc', $],
        )
    ]
)
