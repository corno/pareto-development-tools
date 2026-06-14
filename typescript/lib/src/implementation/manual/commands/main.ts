import * as _p from 'pareto-core/dist/command'
import * as _pt from 'pareto-core/dist/assign'

import * as signatures from "../../../interface/signatures"

//data types
import * as d_main from "pareto-resources/dist/interface/to_be_generated/temp_main"
import * as d_parse from "../../../interface/to_be_generated/parse"
import * as d_execute_command from "../../../interface/to_be_generated/execute_command"

//dependencies
import * as r_instruction from "../refiners/execute_command/main"
import * as t_api_to_fountain_pen from "../transformers/execute_command/fountain_pen"
import * as t_bin_to_fountain_pen from "../transformers/parse/fountain_pen"

import * as sh from "pareto-fountain-pen/dist/shorthands/prose"


type My_Error =
    | ['parse', d_parse.Error]
    | ['execute command', d_execute_command.Error]

export const $$: signatures.commands.main = _p.command_procedure(
    ($d, $s, $q, $c) => [
        _p.handle_error<d_main.Error, My_Error>(
            [
                _p.refine_without_error_transformation(

                    // parse command line instruction
                    (abort) => r_instruction.Command(
                        $d,
                        ($) => abort(['parse', $]),
                    ),

                    // execute API command
                    ($v) => [
                        $c.api.execute(
                            $v,
                            ($) => ['execute command', $],
                        )
                    ],
                )

            ],
            ($) => [

                $c['log error'].execute(
                    {
                        'message': sh.pg.sentences([
                            sh.sentence([
                                _pt.decide.state($, ($) => {
                                    switch ($[0]) {
                                        case 'parse': return _pt.ss($, ($) => t_bin_to_fountain_pen.Error($))
                                        case 'execute command': return _pt.ss($, ($) => t_api_to_fountain_pen.Error($))
                                        default: return _pt.au($[0])
                                    }
                                })
                            ])
                        ])
                    },
                    ($) => ({
                        'exit code': 2
                    })
                )
            ],
            () => ({
                'exit code': 1,
            })
        ),
    ]
)
