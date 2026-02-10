import * as _p from 'pareto-core/dist/command'
import * as _pt from 'pareto-core/dist/assign'

import * as signatures from "../../../interface/signatures"

//data types
import * as d from "../../../interface/to_be_generated/push"

//dependencies
import * as t_path_to_text from "pareto-resources/dist/implementation/manual/transformers/path/text"

//shorthands
import * as sh from "../../../../../temp_loc_to_string"

export const $$: signatures.commands.push = _p.command_procedure(
    ($p, $cr) => [
        $cr.git.execute(
            {
                'args': _pt.list.nested_literal_old([
                    $p.path.__decide(
                        ($) => _pt.list.literal([
                            "-C",
                            sh.serialize(t_path_to_text.Context_Path($)),
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