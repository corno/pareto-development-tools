import * as _p from 'pareto-core/dist/command'
import * as _pt from 'pareto-core/dist/assign'

import * as signatures from "../../../interface/signatures"


import * as d from "../../../interface/to_be_generated/tsc"

//dependencies
import * as t_path_to_text from "pareto-resources/dist/implementation/manual/transformers/path/text"

import * as sh from "../../../temp_loc_to_string"

export const $$: signatures.commands.tsc = _p.command_procedure(

    // tsc
    ($p, $cr) => [
        $cr.tsc.execute(
            {
                'args': _pt.list.nested_literal_old([
                    $p.path.__decide(
                        ($) => _pt.list.literal([
                            "--project",
                            sh.serialize(t_path_to_text.Node_Path($)),
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
