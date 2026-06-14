import * as _p from 'pareto-core/dist/command'
import * as _pt from 'pareto-core/dist/assign'

import * as signatures from "../../../interface/signatures"

//data types
import * as d from "../../../interface/to_be_generated/git_commit"

//shorthands
import * as sh from "pareto-fountain-pen/dist/shorthands/prose"

export const $$: signatures.commands.git_commit = _p.command_procedure(

    ($d, $s, $q, $c) => [


        _p.if_.direct(
            $d.instruction['accept broken commits'],
            [

                _p.pseudo_query_successfully_executed<d.Error, null>( //testing to determine the commit message
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
                                'path': _p.optional.literal.set($d['path']),
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
                        'path': _p.optional.literal.set($d['path']),
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
