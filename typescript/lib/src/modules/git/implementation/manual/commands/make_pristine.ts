import * as _p from 'pareto-core/dist/command'
import * as _pt from 'pareto-core/dist/assign'

import * as signatures from "../../../interface/signatures"

//data types
import * as d from "../../../interface/to_be_generated/make_pristine"

//dependencies
import * as t_path_to_text from "pareto-resources/dist/implementation/manual/transformers/unrestricted_path/text"

export const $$: signatures.commands.make_pristine = _p.command_procedure(
    ($d, $s, $q, $c) => [
        $c.git.execute(
            {
                'working directory': _p.optional.literal.not_set(),
                'args': _pt.list.nested_literal_old([
                    $d.path.__decide(
                        ($) => _pt.list.literal([
                            "-C",
                            t_path_to_text.Context_Path($),
                        ]),
                        () => _pt.list.literal([])
                    ),
                    _pt.list.literal([
                        "clean",
                        "--force",
                        "-d", // remove whole directories
                        "-X", // remove only ignored files (not the capital X as opposed to -x which removes all untracked files, including unignored ones)

                    ])
                ]),
            },
            ($) => ['unexpected error', $],
        )
    ]
)