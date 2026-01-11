import * as _p from 'pareto-core-command'
import * as _pt from 'pareto-core-transformer'

import * as signatures from "../../../interface/signatures"

//data types
import * as d from "../../../interface/to_be_generated/push"

//dependencies
import * as s_path from "pareto-resources/dist/implementation/manual/schemas/path/serializers"

export const $$: signatures.commands.push = _p.command_procedure(
    ($p, $cr) => [
        $cr.git.execute(
            {
                'args': _pt.list.nested_literal([
                    $p.path.__decide(
                        ($) => _pt.list.literal([
                            `-C`,
                            s_path.Context_Path($),
                        ]),
                        () => _pt.list.literal([])
                    ),
                    _pt.list.literal([
                        `push`,
                    ])
                ]),
            },
            ($): d.Error => ['could not push', $],
        )
    ]
)