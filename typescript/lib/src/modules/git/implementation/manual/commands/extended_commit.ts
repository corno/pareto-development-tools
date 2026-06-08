import * as _p from 'pareto-core/dist/command'
import * as _pt from 'pareto-core/dist/assign'
import _p_text_from_list from 'pareto-core/dist/_p_text_from_list'

import * as signatures from "../../../interface/signatures"

//data types
import * as d from "../../../interface/to_be_generated/extended_commit"
import * as d_fp from "pareto-fountain-pen/dist/interface/generated/liana/schemas/prose/data"

//dependencies
import * as t_path_to_text from "pareto-resources/dist/implementation/manual/transformers/unrestricted_path/text"

export const $$: signatures.commands.extended_commit = _p.command_procedure(
    ($p, $cr, $qr) => [
        _p.if_.query(
            $qr['git is repository clean'](
                {
                    'path': $p.path
                },
                ($): d.Error => ['asserting git not clean', $],
            ).transform(
                ($) => !$
            ),
            [
                _p.if_.direct(
                    $p.instruction['stage all changes'],
                    [
                        $cr.git.execute(
                            {
                                'working directory': _p.optional.literal.not_set(),
                                'args': _pt.list.nested_literal_old([
                                    $p.path.__decide(
                                        ($) => _pt.list.literal([
                                            "-C",
                                            t_path_to_text.Context_Path($),
                                        ]),
                                        () => undefined
                                    ),
                                    _pt.list.literal([
                                        "add",
                                        "--all",
                                    ])
                                ]),
                            },
                            ($): d.Error => ['could not stage', $],
                        )
                    ]
                ),
                $cr.git.execute(
                    {
                        'working directory': _p.optional.literal.not_set(),
                        'args': _pt.list.nested_literal_old([
                            $p.path.__decide(
                                ($) => _pt.list.literal([
                                    "-C",
                                    t_path_to_text.Context_Path($),
                                ]),
                                () => undefined
                            ),
                            _pt.list.literal([
                                "commit",
                                "-m",
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
                                'working directory': _p.optional.literal.not_set(),
                                'args': _pt.list.nested_literal_old([
                                    $p.path.__decide(
                                        ($) => _pt.list.literal([
                                            "-C",
                                            t_path_to_text.Context_Path($),
                                        ]),
                                        () => undefined
                                    ),
                                    _pt.list.literal([
                                        "push",
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