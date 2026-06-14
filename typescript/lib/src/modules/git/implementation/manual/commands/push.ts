import * as p_ from 'pareto-core/dist/command'
import * as p_t from 'pareto-core/dist/assign'

import * as signatures from "../../../interface/commands"

//data types
import * as d from "../../../interface/to_be_generated/push"

//dependencies
import * as t_path_to_text from "pareto-resources/dist/implementation/manual/transformers/unrestricted_path/text"


export const $$: signatures.procedures.push = p_.command_procedure(
    ($d, $s, $q, $c) => [
        $c.git.execute(
            {
                'working directory': p_.optional.literal.not_set(),
                'args': p_t.list.nested_literal_old([
                    $d.path.__decide(
                        ($) => p_t.list.literal([
                            "-C",
                            t_path_to_text.Context_Path($),
                        ]),
                        () => p_t.list.literal([])
                    ),
                    p_t.list.literal([
                        "push",
                    ])
                ]),
            },
            ($): d.Error => ['could not push', $],
        )
    ]
)