import * as p_ from 'pareto-core/implementation/command'
import * as p_t from 'pareto-core/implementation/transformer'

//interface dependencies
import type * as command_interfaces from "../../commands/interfaces.js"
import type * as command_interfaces_version_control from "../../submodules/version_control_api/commands/interfaces.js"

//schemas
import * as d from "../../schemas/git_commit.js"

export const $$: p_.Command_Implementation<
    command_interfaces.version_control_commit,
    null,
    null,
    {
        'build and validate': command_interfaces.build_and_validate
        'version control extended commit': command_interfaces_version_control.extended_commit
    }
> = p_.command(

    ($d, $s, $q, $c) => [

        p_.s.if_(
            $d.instruction['accept broken commits'],
            [

                p_.s.test_for_successful_execution<d.Error, null>( //testing to determine the commit message
                    [

                        $c['build and validate'].execute(
                            {
                                'path': $d['path'],
                            },
                            ($) => null,
                        ),

                    ],
                    ($) => [

                        $c['version control extended commit'].execute(
                            {
                                'path': p_.literal.set($d['path']),
                                'instruction': {
                                    'stage all changes': true,
                                    'commit message': "pdt"
                                        + p_t.from.optional($).decide(
                                            () => "(broken)",
                                            () => "",
                                        )
                                        + ": "
                                        + $d.instruction['commit message'],
                                    'push after commit': true,
                                },
                            },
                            ($): d.Error => ['version control extended commit', $],
                        )
                        
                    ]
                ),

            ],
            [
                $c['build and validate'].execute(
                    {
                        'path': $d['path'],
                    },
                    ($): d.Error => ['error while running build and validate', $],
                ),
                $c['version control extended commit'].execute(
                    {
                        'path': p_.literal.set($d['path']),
                        'instruction': {
                            'stage all changes': true,
                            'commit message': "pdt: " + $d.instruction['commit message'],
                            'push after commit': true,
                        },
                    },
                    ($): d.Error => ['version control extended commit', $],
                )

            ]
        ),


    ]
)
