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
                'working directory': p.literal.not_set(),
                'args': pa.literal.nested_list([
                    $d.path.__decide(
                        ($) => pa.literal.list([
                            "-C",
                            t_path_to_text.Context_Path($),
                        ]),
                        () => pa.literal.list([])
                    ),
                    pa.literal.list([
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
                'working directory': p.literal.not_set(),
                'args': pa.literal.nested_list([
                    $d.path.__decide(
                        ($) => pa.literal.list([
                            "-C",
                            t_path_to_text.Context_Path($),
                        ]),
                        () => pa.literal.list([])
                    ),
                    pa.literal.list([
                        "add",
                        "--all",
                    ])
                ]),
            },
            ($) => ['could not add', $],
        ),
        $c.git.execute(
            {
                'working directory': p.literal.not_set(),
                'args': pa.literal.nested_list([
                    $d.path.__decide(
                        ($) => pa.literal.list([
                            "-C",
                            t_path_to_text.Context_Path($),
                        ]),
                        () => pa.literal.list([])
                    ),
                    pa.literal.list([
                        "clean",
                        "-fd",
                    ])
                ]),
            },
            ($) => ['could not clean', $],
        ),
    ]
)