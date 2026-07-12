import * as p_ from 'pareto-core/implementation/command'
import * as p_t from 'pareto-core/implementation/transformer'
import p_super_query_result from 'pareto-core/implementation/query/super_query_result'

import type * as interface_ from "../../declarations/commands.js"

//schemas
import * as d from "../../../version_control_api/interface/schemas/extended_commit.js"

//dependencies
import * as t_path_to_text from "pareto-resources/implementation/transformers/unrestricted_path/text"

export const $$: interface_.extended_commit = p_.command(
    ($d, $s, $q, $c) => [

        p_.s.query(
            p_super_query_result($q['repository no open changes'](
                {
                    'path': $d.path
                },
                ($): d.Error => ['asserting no open changes', $],
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
                                            p_t.from.optional($d.path).decide(
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
                                    p_t.from.optional($d.path).decide(
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
                                            p_t.from.optional($d.path).decide(
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