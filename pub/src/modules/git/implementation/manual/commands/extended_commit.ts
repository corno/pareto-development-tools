import * as _pc from 'pareto-core-command'
import * as _pt from 'pareto-core-transformer'

import * as signatures from "../../../interface/signatures"

//data types
import * as d from "../../../interface/to_be_generated/extended_commit"

//dependencies
import * as s_path from "pareto-resources/dist/implementation/manual/schemas/path/serializers"


export const $$: signatures.commands.extended_commit = _pc.create_command_procedure(
    ($p, $cr, $qr) => [
        _pc.deprecated_conditional.query(
            $qr['git is repository clean'](
                {
                    'path': $p.path
                },
                 ($): d.Error => ['asserting git not clean', $],
            ).transform_result(
                ($) => !$
            ),
            _pc.sequence([
                _pc.if_(
                    $p.instruction['stage all changes'],
                    [
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
                            ($): d.Error => ['could not stage', $],
                        )
                    ]
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
                                `commit`,
                                `-m`,
                                $p.instruction['commit message'],
                            ])
                        ]).flatten(($) => $),
                    },
                    ($): d.Error => ['could not commit', $],
                ),
                _pc.if_(
                    $p.instruction['push after commit'],
                    [
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
                                        `push`,
                                    ])
                                ]).flatten(($) => $),
                            },
                            ($): d.Error => ['could not push', $],
                        )
                    ]
                )
            ]),
        )
    ]
)