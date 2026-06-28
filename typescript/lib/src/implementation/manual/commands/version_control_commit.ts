import * as p_ from 'pareto-core/dist/implementation/command'
import * as p_t from 'pareto-core/dist/implementation/transformer'

import * as interface_ from "../../../interface/commands"

//data types
import * as d from "../../../interface/data/git_commit"

export const $$: interface_.procedures.version_control_commit = p_.command_procedure(

    ($d, $s, $q, $c) => [

        p_.s.if_(
            $d.instruction['accept broken commits'],
            [

                p_.s.test_for_successful_execution<d.Error, null>( //testing to determine the commit message
                    [

                        $c['build and test'].execute(
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
                $c['build and test'].execute(
                    {
                        'path': $d['path'],
                    },
                    ($): d.Error => ['error while running build and test', $],
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
