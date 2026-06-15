import * as p from 'pareto-core/dist/command/implementation'
import * as pa from 'pareto-core/dist/assign'
import p_text_from_list from 'pareto-core/dist/specials/text_from_list'

import * as signatures from "../../../interface/commands"

//data types
import * as d from "../../../interface/to_be_generated/extended_commit"
import * as d_fp from "pareto-fountain-pen/dist/interface/generated/liana/schemas/prose/data"

//dependencies
import * as t_path_to_text from "pareto-resources/dist/implementation/manual/transformers/unrestricted_path/text"

export const $$: signatures.procedures.extended_commit = p.command_procedure(
    ($d, $s, $q, $c) => [
        p.if_.query(
            $q['git is repository clean'](
                {
                    'path': $d.path
                },
                ($): d.Error => ['asserting git not clean', $],
            ).transform(
                ($) => !$
            ),
            [
                p.if_.direct(
                    $d.instruction['stage all changes'],
                    [
                        $c.git.execute(
                            {
                                'working directory': p.literal.not_set(),
                                'args': pa.literal.nested_list([
                                    $d.path.__decide(
                                        ($) => pa.literal.list([
                                            "-C",
                                            t_path_to_text.Context_Path($),
                                        ]),
                                        () => pa.literal.list([])
                                    ),
                                    pa.literal.list([
                                        "add",
                                        "--all",
                                    ])
                                ]),
                            },
                            ($): d.Error => ['could not stage', $],
                        )
                    ]
                ),
                $c.git.execute(
                    {
                        'working directory': p.literal.not_set(),
                        'args': pa.literal.nested_list([
                            $d.path.__decide(
                                ($) => pa.literal.list([
                                    "-C",
                                    t_path_to_text.Context_Path($),
                                ]),
                                () => pa.literal.list([])
                            ),
                            pa.literal.list([
                                "commit",
                                "-m",
                                $d.instruction['commit message'],
                            ])
                        ]),
                    },
                    ($): d.Error => ['could not commit', $],
                ),
                p.if_.direct(
                    $d.instruction['push after commit'],
                    [
                        $c.git.execute(
                            {
                                'working directory': p.literal.not_set(),
                                'args': pa.literal.nested_list([
                                    $d.path.__decide(
                                        ($) => pa.literal.list([
                                            "-C",
                                            t_path_to_text.Context_Path($),
                                        ]),
                                        () => pa.literal.list([])
                                    ),
                                    pa.literal.list([
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