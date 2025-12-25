import * as _easync from 'exupery-core-async'
import * as _ea from 'exupery-core-alg'

import * as signatures from "../../interface/signatures"

//data types
import * as d from "../../interface/to_be_generated/extended_commit"

//dependencies
import { $$ as op_flatten } from "pareto-standard-operations/dist/implementation/operations/pure/list/flatten"
import * as s_path from "exupery-resources/dist/implementation/serializers/schemas/path"


export const $$: signatures.commands.extended_commit = _easync.create_command_procedure(
    ($p, $cr, $qr) => [
        _easync.p.deprecated_conditional.query(
            $qr['git is repository clean'](
                {
                    'path': $p.path
                },
                 ($): d.Error => ['asserting git not clean', $],
            ).transform_result(
                ($) => !$
            ),
            _easync.p.sequence([
                _easync.p.if_(
                    $p.instruction['stage all changes'],
                    [
                        $cr.git.execute(
                            {
                                'args': op_flatten(_ea.list_literal([
                                    $p.path.transform(
                                        ($) => _ea.list_literal([
                                            `-C`,
                                            s_path.Context_Path($),
                                        ]),
                                        () => _ea.list_literal([])
                                    ),
                                    _ea.list_literal([
                                        `add`,
                                        `--all`,
                                    ])
                                ])),
                            },
                            ($): d.Error => ['could not stage', $],
                        )
                    ]
                ),
                $cr.git.execute(
                    {
                        'args': op_flatten(_ea.list_literal([
                            $p.path.transform(
                                ($) => _ea.list_literal([
                                    `-C`,
                                    s_path.Context_Path($),
                                ]),
                                () => _ea.list_literal([])
                            ),
                            _ea.list_literal([
                                `commit`,
                                `-m`,
                                $p.instruction['commit message'],
                            ])
                        ])),
                    },
                    ($): d.Error => ['could not commit', $],
                ),
                _easync.p.if_(
                    $p.instruction['push after commit'],
                    [
                        $cr.git.execute(
                            {
                                'args': op_flatten(_ea.list_literal([
                                    $p.path.transform(
                                        ($) => _ea.list_literal([
                                            `-C`,
                                            s_path.Context_Path($),
                                        ]),
                                        () => _ea.list_literal([])
                                    ),
                                    _ea.list_literal([
                                        `push`,
                                    ])
                                ]))
                            },
                            ($): d.Error => ['could not push', $],
                        )
                    ]
                )
            ]),
        )
    ]
)