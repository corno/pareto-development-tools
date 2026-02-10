import * as _p from 'pareto-core/dist/command'
import * as _pt from 'pareto-core/dist/assign'

import * as signatures from "../../../interface/signatures"

//data types
import * as d from "pareto-resources/dist/interface/to_be_generated/temp_main"
import * as d_parse from "../../../interface/to_be_generated/parse"
import * as d_api from "../../../interface/to_be_generated/execute_command"
import * as d_text from "pareto-fountain-pen/dist/interface/to_be_generated/list_of_characters"

//dependencies
import * as r_instruction from "../refiners/execute_command/main"
import * as t_api_to_fountain_pen from "../transformers/execute_command/fountain_pen"
import * as t_bin_to_fountain_pen from "../transformers/parse/fountain_pen"

import * as sh from "pareto-fountain-pen/dist/shorthands/prose"


type My_Error =
    | ['parse', d_parse.Error]
    | ['api', d_api.Error]

export const $$: signatures.commands.main = _p.command_procedure(
    ($p, $cr) => [
        _p.handle_error<d.Error, My_Error>(
            [
                _p.refine_without_error_transformation(

                    // parse command line instruction
                    (abort) => r_instruction.Command(
                        $p,
                        ($) => abort(['parse', $]),
                    ),

                    // execute API command
                    ($v) => [
                        $cr.api.execute(
                            $v,
                            ($) => ['api', $],
                        )
                    ],
                )

            ],
            ($) => [

                $cr['log error'].execute(
                    {
                        'message': sh.pg.sentences([
                            sh.sentence([
                                _p.decide.state($, ($) => {
                                    switch ($[0]) {
                                        case 'parse': return _p.ss($, ($) => t_bin_to_fountain_pen.Error($))
                                        case 'api': return _p.ss($, ($) => t_api_to_fountain_pen.Error($))
                                        default: return _p.au($[0])
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
            ({
                'exit code': 1,
            })
        ),
    ]
)
