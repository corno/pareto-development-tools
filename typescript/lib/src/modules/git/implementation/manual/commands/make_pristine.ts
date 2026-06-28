import * as p_ from 'pareto-core/dist/implementation/command'
import * as p_t from 'pareto-core/dist/implementation/transformer'

import * as interface_ from "../../../../version_control_api/interface/commands"

//dependencies
import * as t_path_to_text from "pareto-resources/dist/implementation/manual/transformers/unrestricted_path/text"

export const $$: interface_.procedures.make_pristine = p_.command_procedure(
    ($d, $s, $q, $c) => [
        $c.git.execute(
            {
                'working directory': p_.literal.not_set(),
                'args': p_.literal.segmented_list([
                    p_t.from.optional($d.path).decide(
                        ($) => p_.literal.list([
                            "-C",
                            t_path_to_text.Context_Path($),
                        ]),
                        () => p_.literal.list([])
                    ),
                    p_.literal.list([
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