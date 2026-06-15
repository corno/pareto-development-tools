import * as p_ from 'pareto-core/dist/implementation/command'

import * as signatures from "../../../interface/commands"

//data types
import * as d from "../../../interface/to_be_generated/extended_commit"
import * as d_fp from "pareto-fountain-pen/dist/interface/generated/liana/schemas/prose/data"

//dependencies
import * as t_path_to_text from "pareto-resources/dist/implementation/manual/transformers/unrestricted_path/text"

export const $$: signatures.procedures.extended_commit = p_.command_procedure(
    ($d, $s, $q, $c) => [
        p_.if_.query(
            $q['git is repository clean'](
                {
                    'path': $d.path
                },
                ($): d.Error => ['asserting git not clean', $],
            ).transform(
                ($) => !$
            ),
            [
                p_.if_.direct(
                    $d.instruction['stage all changes'],
                    [
                        $c.git.execute(
                            {
                                'working directory': p_.literal.not_set(),
                                'args': p_.literal.nested_list([
                                    $d.path.__decide(
                                        ($) => p_.literal.list([
                                            "-C",
                                            t_path_to_text.Context_Path($),
                                        ]),
                                        () => p_.literal.list([])
                                    ),
                                    p_.literal.list([
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
                        'working directory': p_.literal.not_set(),
                        'args': p_.literal.nested_list([
                            $d.path.__decide(
                                ($) => p_.literal.list([
                                    "-C",
                                    t_path_to_text.Context_Path($),
                                ]),
                                () => p_.literal.list([])
                            ),
                            p_.literal.list([
                                "commit",
                                "-m",
                                $d.instruction['commit message'],
                            ])
                        ]),
                    },
                    ($): d.Error => ['could not commit', $],
                ),
                p_.if_.direct(
                    $d.instruction['push after commit'],
                    [
                        $c.git.execute(
                            {
                                'working directory': p_.literal.not_set(),
                                'args': p_.literal.nested_list([
                                    $d.path.__decide(
                                        ($) => p_.literal.list([
                                            "-C",
                                            t_path_to_text.Context_Path($),
                                        ]),
                                        () => p_.literal.list([])
                                    ),
                                    p_.literal.list([
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