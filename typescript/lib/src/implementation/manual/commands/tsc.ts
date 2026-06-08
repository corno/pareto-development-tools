import * as _p from 'pareto-core/dist/command'
import * as _pt from 'pareto-core/dist/assign'

import * as signatures from "../../../interface/signatures"

//dependencies
import * as t_path_to_text from "pareto-resources/dist/implementation/manual/transformers/unrestricted_path/text"

export const $$: signatures.commands.tsc = _p.command_procedure(

    // tsc
    ($p, $cr) => [
        $cr.tsc.execute(
            {
                'working directory': _p.optional.literal.not_set(),
                'args': _pt.list.nested_literal_old([
                    $p.path.__decide(
                        ($) => _pt.list.literal([
                            "--project",
                            t_path_to_text.Context_Path($),
                        ]),
                        () => _pt.list.literal([])
                    ),
                    _pt.list.literal([
                        "--pretty",
                    ]),
                ]),
            },
            ($) => ['error while running tsc', $],
        )
    ]
)
