import * as _p from 'pareto-core-command'
import * as _pt from 'pareto-core-transformer'

import * as signatures from "../../../interface/signatures"

//data types
import * as d from "../../../interface/to_be_generated/extended_commit"

//dependencies
import * as s_path from "pareto-resources/dist/implementation/manual/schemas/path/serializers"


export const $$: signatures.commands.extended_commit = _p.command_procedure(
    ($p, $cr, $qr) => [
        _p.if_.query(
            $qr['git is repository clean'](
                {
                    'path': $p.path
                },
                 ($): d.Error => ['asserting git not clean', $],
            ).transform_result(
                ($) => !$
            ),
            [
                _p.if_.direct(
                    $p.instruction['stage all changes'],
                    [
                        $cr.git.execute(
                            {
                                'args': _pt.list.nested_literal([
                                    $p.path.transform(
                                        ($) => _pt.list.literal([
                                            `-C`,
                                            s_path.Context_Path($),
                                        ]),
                                        () => undefined
                                    ),
                                    _pt.list.literal([
                                        `add`,
                                        `--all`,
                                    ])
                                ]),
                            },
                            ($): d.Error => ['could not stage', $],
                        )
                    ]
                ),
                $cr.git.execute(
                    {
                        'args': _pt.list.nested_literal([
                            $p.path.transform(
                                ($) => _pt.list.literal([
                                    `-C`,
                                    s_path.Context_Path($),
                                ]),
                                () => undefined
                            ),
                            _pt.list.literal([
                                `commit`,
                                `-m`,
                                $p.instruction['commit message'],
                            ])
                        ]),
                    },
                    ($): d.Error => ['could not commit', $],
                ),
                _p.if_.direct(
                    $p.instruction['push after commit'],
                    [
                        $cr.git.execute(
                            {
                                'args': _pt.list.nested_literal([
                                    $p.path.transform(
                                        ($) => _pt.list.literal([
                                            `-C`,
                                            s_path.Context_Path($),
                                        ]),
                                        () => undefined
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
            ],
        )
    ]
)