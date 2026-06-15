import * as p_ from 'pareto-core/dist/implementation/command'

import * as signatures from "../../../interface/commands"

//data types
import * as d from "../../../interface/data/push"

//dependencies
import * as t_path_to_text from "pareto-resources/dist/implementation/manual/transformers/unrestricted_path/text"


export const $$: signatures.procedures.push = p_.command_procedure(
    ($d, $s, $q, $c) => [
        $c.git.execute(
            {
                'working directory': p_.literal.not_set(),
                'args': p_.literal.nested_list([
                    $d.path.__decide(
                        ($) => p_.literal.list([
                            "-C",
                            t_path_to_text.Context_Path($),
                        ]),
                        () => p_.literal.list([])
                    ),
                    p_.literal.list([
                        "push",
                    ])
                ]),
            },
            ($): d.Error => ['could not push', $],
        )
    ]
)