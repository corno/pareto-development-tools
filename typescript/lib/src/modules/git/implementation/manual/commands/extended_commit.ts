import * as p_ from 'pareto-core/dist/implementation/command'
import p_super_query_result from 'pareto-core/dist/implementation/query/super_query_result'

import * as interface_ from "../../../interface/commands"

//data types
import * as d from "../../../interface/data/extended_commit"

//dependencies
import * as t_path_to_text from "pareto-resources/dist/implementation/manual/transformers/unrestricted_path/text"

export const $$: interface_.procedures.extended_commit = p_.command_procedure(
    ($d, $s, $q, $c) => [

        p_.s.query(
            p_super_query_result($q['git is repository clean'](
                {
                    'path': $d.path
                },
                ($): d.Error => ['asserting git not clean', $],
            )),
            ($) => [

                p_.s.if_(
                    !$, // if not clean
                    [
                        p_.s.if_(
                            $d.instruction['stage all changes'],
                            [
                                $c.git.execute(
                                    {
                                        'working directory': p_.literal.not_set(),
                                        'args': p_.literal.segmented_list([
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
                                'args': p_.literal.segmented_list([
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

                        p_.s.if_(
                            $d.instruction['push after commit'],
                            [
                                $c.git.execute(
                                    {
                                        'working directory': p_.literal.not_set(),
                                        'args': p_.literal.segmented_list([
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

                    ]
                )

            ]
        ),

    ]
)