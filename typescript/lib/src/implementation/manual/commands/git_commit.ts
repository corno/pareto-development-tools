import * as p_ from 'pareto-core/dist/implementation/command'

import * as interface_ from "../../../interface/commands"

//data types
import * as d from "../../../interface/data/git_commit"

//shorthands
import * as sh from "pareto-fountain-pen/dist/shorthands/prose"

export const $$: interface_.procedures.git_commit = p_.command_procedure(

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
                        $c['git extended commit'].execute(
                            {
                                'path': p_.literal.set($d['path']),
                                'instruction': {
                                    'stage all changes': true,
                                    'commit message': "pdt"
                                        + $.__decide(
                                            () => "(broken)",
                                            () => "",
                                        )
                                        + ": "
                                        + $d.instruction['commit message'],
                                    'push after commit': true,
                                },
                            },
                            ($): d.Error => ['git extended commit', $],
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
                $c['git extended commit'].execute(
                    {
                        'path': p_.literal.set($d['path']),
                        'instruction': {
                            'stage all changes': true,
                            'commit message': "pdt: " + $d.instruction['commit message'],
                            'push after commit': true,
                        },
                    },
                    ($): d.Error => ['git extended commit', $],
                )

            ]
        ),


    ]
)
