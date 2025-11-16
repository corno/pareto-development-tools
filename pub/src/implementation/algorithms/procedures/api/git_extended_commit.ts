import * as _easync from 'exupery-core-async'
import * as _ea from 'exupery-core-alg'

import * as d from "../../../../interface/temp/procedures/commands/git_extended_commit"

import { $$ as op_flatten } from "pareto-standard-operations/dist/implementation/algorithms/operations/pure/list/flatten"


export const $$: d.Procedure = _easync.create_command_procedure(
    ($r, $p) => _easync.p.conditional.query(
        $r.queries['git is clean'](
            {
                'path': $p.path
            },
        ).transform_result(
            ($) => !$
        ).transform_error(
            ($): d.Error => ['asserting git not clean', $]
        ),
        _easync.p.sequence([
            _easync.p.conditional.direct(
                $p.instruction['stage all changes'],
                $r.commands.git.execute.direct(
                    ($): d.Error => ['could not stage', $],
                    {
                        'args': op_flatten(_ea.array_literal([
                            $p.path.transform(
                                ($) => _ea.array_literal([
                                    `-C`,
                                    $,
                                ]),
                                () => _ea.array_literal([])
                            ),
                            _ea.array_literal([
                                `add`,
                                `--all`,
                            ])
                        ])),
                    },
                )
            ),
            $r.commands.git.execute.direct(
                ($): d.Error => ['could not commit', $],
                {
                    'args': op_flatten(_ea.array_literal([
                        $p.path.transform(
                            ($) => _ea.array_literal([
                                `-C`,
                                $,
                            ]),
                            () => _ea.array_literal([])
                        ),
                        _ea.array_literal([
                            `commit`,
                            `-m`,
                            $p.instruction['commit message'],
                        ])
                    ])),
                },
            ),
            _easync.p.conditional.direct(
                $p.instruction['push after commit'],
                $r.commands.git.execute.direct(
                    ($): d.Error => ['could not push', $],
                    {
                        'args': op_flatten(_ea.array_literal([
                            $p.path.transform(
                                ($) => _ea.array_literal([
                                    `-C`,
                                    $,
                                ]),
                                () => _ea.array_literal([])
                            ),
                            _ea.array_literal([
                                `push`,
                            ])
                        ]))
                    },
                )
            )
        ]),
    )
)