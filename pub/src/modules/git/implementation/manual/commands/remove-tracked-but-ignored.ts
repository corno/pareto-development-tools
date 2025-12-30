import * as _pc from 'pareto-core-command'
import * as _pt from 'pareto-core-transformer'

import * as signatures from "../../../interface/signatures"

//data types
import * as d from "../../../interface/to_be_generated/remove_tracked_but_ignored"

//dependencies
import * as s_path from "exupery-resources/dist/implementation/serializers/schemas/path"

export const $$: signatures.commands.remove_tracked_but_ignored = _pc.create_command_procedure(
    ($p, $cr) => [
        $cr['assert is clean'].execute(
            {
                'path': $p.path,
            },
            ($): d.Error => _pt.cc($, ($) => {
                switch ($[0]) {
                    case 'working directory is not clean': return _pt.ss($, ($): d.Error => ['not clean', null])
                    case 'unexpected error': return _pt.ss($, ($): d.Error => ['unexpected error', $])
                    default: return _pt.au($[0])
                }
            }),
        ),
        $cr.git.execute(
            {
                'args': _pt.list_literal([
                    $p.path.transform(
                        ($) => _pt.list_literal([
                            `-C`,
                            s_path.Context_Path($),
                        ]),
                        () => _pt.list_literal([])
                    ),
                    _pt.list_literal([
                        `rm`,
                        `-r`,
                        `--cached`,
                        `.`
                    ])
                ]).flatten(($) => $),
            },
            ($) => ['could not remove', $],
        ),
        $cr.git.execute(
            {
                'args': _pt.list_literal([
                    $p.path.transform(
                        ($) => _pt.list_literal([
                            `-C`,
                            s_path.Context_Path($),
                        ]),
                        () => _pt.list_literal([])
                    ),
                    _pt.list_literal([
                        `add`,
                        `--all`,
                    ])
                ]).flatten(($) => $),
            },
            ($) => ['could not add', $],
        ),
        $cr.git.execute(
            {
                'args': _pt.list_literal([
                    $p.path.transform(
                        ($) => _pt.list_literal([
                            `-C`,
                            s_path.Context_Path($),
                        ]),
                        () => _pt.list_literal([])
                    ),
                    _pt.list_literal([
                        `clean`,
                        `-fd`,
                    ])
                ]).flatten(($) => $),
            },
            ($) => ['could not clean', $],
        ),
    ]
)