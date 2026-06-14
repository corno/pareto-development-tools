import * as p from 'pareto-core/dist/command/implementation'
import * as pa from 'pareto-core/dist/assign'

import * as signatures from "../../../interface/commands"

//data types
import * as d from "../../../interface/to_be_generated/remove_tracked_but_ignored"

//dependencies
import * as t_path_to_text from "pareto-resources/dist/implementation/manual/transformers/unrestricted_path/text"

export const $$: signatures.procedures.remove_tracked_but_ignored = p.command_procedure(
    ($d, $s, $q, $c) => [
        $c['assert is clean'].execute(
            {
                'path': $d.path,
            },
            ($): d.Error => pa.decide.state($, ($) => {
                switch ($[0]) {
                    case 'working directory is not clean': return pa.ss($, ($): d.Error => ['not clean', null])
                    case 'unexpected error': return pa.ss($, ($): d.Error => ['unexpected error', $])
                    default: return pa.au($[0])
                }
            }),
        ),
        $c.git.execute(
            {
                'working directory': p.optional.literal.not_set(),
                'args': pa.list.nested_literal_old([
                    $d.path.__decide(
                        ($) => pa.list.literal([
                            "-C",
                            t_path_to_text.Context_Path($),
                        ]),
                        () => pa.list.literal([])
                    ),
                    pa.list.literal([
                        "rm",
                        "-r",
                        "--cached",
                        "."
                    ])
                ]),
            },
            ($) => ['could not remove', $],
        ),
        $c.git.execute(
            {
                'working directory': p.optional.literal.not_set(),
                'args': pa.list.nested_literal_old([
                    $d.path.__decide(
                        ($) => pa.list.literal([
                            "-C",
                            t_path_to_text.Context_Path($),
                        ]),
                        () => pa.list.literal([])
                    ),
                    pa.list.literal([
                        "add",
                        "--all",
                    ])
                ]),
            },
            ($) => ['could not add', $],
        ),
        $c.git.execute(
            {
                'working directory': p.optional.literal.not_set(),
                'args': pa.list.nested_literal_old([
                    $d.path.__decide(
                        ($) => pa.list.literal([
                            "-C",
                            t_path_to_text.Context_Path($),
                        ]),
                        () => pa.list.literal([])
                    ),
                    pa.list.literal([
                        "clean",
                        "-fd",
                    ])
                ]),
            },
            ($) => ['could not clean', $],
        ),
    ]
)