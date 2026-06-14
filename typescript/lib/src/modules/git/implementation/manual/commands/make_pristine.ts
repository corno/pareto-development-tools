import * as p from 'pareto-core/dist/command/implementation'
import * as pa from 'pareto-core/dist/assign'

import * as signatures from "../../../interface/commands"

//data types
import * as d from "../../../interface/to_be_generated/make_pristine"

//dependencies
import * as t_path_to_text from "pareto-resources/dist/implementation/manual/transformers/unrestricted_path/text"

export const $$: signatures.procedures.make_pristine = p.command_procedure(
    ($d, $s, $q, $c) => [
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
                    p.list.literal([
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