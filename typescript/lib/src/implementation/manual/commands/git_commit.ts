import * as pt from 'pareto-core/dist/command'
import * as _pt from 'pareto-core/dist/assign'

import * as signatures from "../../../interface/commands"

//data types
import * as d from "../../../interface/to_be_generated/git_commit"

//shorthands
import * as sh from "pareto-fountain-pen/dist/shorthands/prose"

export const $$: signatures.procedures.git_commit = pt.command_procedure(

    ($d, $s, $q, $c) => [


        pt.if_.direct(
            $d.instruction['accept broken commits'],
            [

                pt.pseudo_query_successfully_executed<d.Error, null>( //testing to determine the commit message
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
                                'path': pt.optional.literal.set($d['path']),
                                'instruction': {
                                    'stage all changes': true,
                                    'commit message': "pdt" + ($ ? "" : "(broken)") + ": " + $d.instruction['commit message'],
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
                        'path': pt.optional.literal.set($d['path']),
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
