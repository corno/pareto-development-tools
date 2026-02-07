import * as _p from 'pareto-core/dist/command'
import * as _pt from 'pareto-core/dist/assign'

import * as signatures from "../../../interface/signatures"

//data types
import * as d from "../../../interface/to_be_generated/git_commit"

//shorthands
import * as sh from "pareto-fountain-pen/dist/shorthands/block"

export const $$: signatures.commands.git_commit = _p.command_procedure(

    ($p, $cr) => [


        _p.if_.direct(
            $p.instruction['accept broken commits'],
            [

                _p.pseudo_query_successfully_executed<d.Error, null>( //testing to determine the commit message
                    [

                        $cr['build and test'].execute(
                            {
                                'path': $p['path'],
                            },
                            ($) => null,
                        ),

                    ],
                    ($) => [
                        $cr['git extended commit'].execute(
                            {
                                'path': _p.optional.literal.set($p['path']),
                                'instruction': {
                                    'stage all changes': true,
                                    'commit message': sh.ph.literal("pdt" + ($ ? "" : "(broken)") + ": " + $p.instruction['commit message']),
                                    'push after commit': true,
                                },
                            },
                            ($): d.Error => ['git extended commit', $],
                        )
                    ]
                ),

            ],
            [
                $cr['build and test'].execute(
                    {
                        'path': $p['path'],
                    },
                    ($): d.Error => ['error while running build and test', $],
                ),
                $cr['git extended commit'].execute(
                    {
                        'path': _p.optional.literal.set($p['path']),
                        'instruction': {
                            'stage all changes': true,
                            'commit message': sh.ph.literal("pdt: " + $p.instruction['commit message']),
                            'push after commit': true,
                        },
                    },
                    ($): d.Error => ['git extended commit', $],
                )

            ]
        ),


    ]
)
