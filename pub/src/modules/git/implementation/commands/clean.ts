import * as _pc from 'pareto-core-command'
import * as _pt from 'pareto-core-transformer'

import * as signatures from "../../interface/signatures"

//data types
import * as d from "../../interface/to_be_generated/clean"

//dependencies
import * as s_path from "exupery-resources/dist/implementation/serializers/schemas/path"

export const $$: signatures.commands.clean = _pc.create_command_procedure(
    ($p, $cr) => [
        $cr.git.execute(
            {
                'args': _pt.list_literal([
                    $p.path.transform(
                        ($) => _pt.list_literal([
                            `-C`,
                            s_path.Node_Path($),
                        ]),
                        () => _pt.list_literal([])
                    ),
                    _pt.list_literal([
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