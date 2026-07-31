import * as p_ from 'pareto-core/implementation/command'
import * as p_t from 'pareto-core/implementation/transformer'
import * as p_s from 'pareto-core/implementation/serializer'
import p_super_query_result from 'pareto-core/implementation/query/super_query_result'

//interface dependencies
import type * as command_interfaces from "../../../version_control_api/commands/interfaces.js"
import type * as command_interfaces_pareto_resources from "pareto-resources/commands/interfaces"
import type * as query_interfaces from "../../../version_control_api/queries/interfaces.js"

//schemas
import * as d from "../../../version_control_api/schemas/extended_commit.js"

//dependencies
import * as ser_path from "pareto-resources/schemas/fs_unrestricted_path/serializers"

export const $$: p_.Command_Implementation<
    command_interfaces.extended_commit,
    null,
    {
        'repository no open changes': query_interfaces.repository_no_open_changes
    },
    {
        'git': command_interfaces_pareto_resources.execute_sandboxed.command_executable
    }
> = p_.command(
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
                                                    ser_path.Context_Path($),
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
                                                ser_path.Context_Path($),
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
                                                        ser_path.Context_Path($),
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