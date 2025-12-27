import * as _easync from 'exupery-core-async'
import * as _ea from 'exupery-core-alg'

import * as signatures from "../../interface/signatures"

//data types
import * as d from "../../interface/to_be_generated/clean"

//dependencies
import * as s_path from "exupery-resources/dist/implementation/serializers/schemas/path"

export const $$: signatures.commands.clean = _easync.create_command_procedure(
    ($p, $cr) => [
        $cr.git.execute(
            {
                'args': _ea.list_literal([
                    $p.path.transform(
                        ($) => _ea.list_literal([
                            `-C`,
                            s_path.Node_Path($),
                        ]),
                        () => _ea.list_literal([])
                    ),
                    _ea.list_literal([
                        `clean`,
                        `--force`,
                        `-d`, // remove whole directories
                        `-X`, // remove only ignored files (not the capital X as opposed to -x which removes all untracked files, including unignored ones)

                    ])
                ]).flatten(($) => $),
            },
            ($) => ['unexpected error', $],
        )
    ]
)