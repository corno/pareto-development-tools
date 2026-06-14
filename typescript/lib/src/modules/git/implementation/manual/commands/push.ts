import * as pt from 'pareto-core/dist/command'
import * as _pt from 'pareto-core/dist/assign'

import * as signatures from "../../../interface/signatures"

//data types
import * as d from "../../../interface/to_be_generated/push"

//dependencies
import * as t_path_to_text from "pareto-resources/dist/implementation/manual/transformers/unrestricted_path/text"


export const $$: signatures.commands.push = pt.command_procedure(
    ($d, $s, $q, $c) => [
        $c.git.execute(
            {
                'working directory': pt.optional.literal.not_set(),
                'args': _pt.list.nested_literal_old([
                    $d.path.__decide(
                        ($) => _pt.list.literal([
                            "-C",
                            t_path_to_text.Context_Path($),
                        ]),
                        () => _pt.list.literal([])
                    ),
                    _pt.list.literal([
                        "push",
                    ])
                ]),
            },
            ($): d.Error => ['could not push', $],
        )
    ]
)