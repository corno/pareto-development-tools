import * as p_ from 'pareto-core/dist/implementation/command'
import * as p_temp from 'pareto-core/dist/implementation/transformer'

import * as signatures from "../../../interface/commands"

//data types
import * as d_main from "pareto-resources/dist/interface/data/temp_main"
import * as d_parse from "../../../interface/data/parse"
import * as d_execute_command from "../../../interface/data/execute_command"

//dependencies
import * as r_instruction from "../refiners/execute_command/main"
import * as t_api_to_fountain_pen from "../transformers/execute_command/fountain_pen"
import * as t_bin_to_fountain_pen from "../transformers/parse/fountain_pen"

//shorthands
import * as sh from "pareto-fountain-pen/dist/shorthands/prose"


type My_Error =
    | ['parse', d_parse.Error]
    | ['execute command', d_execute_command.Error]

export const $$: signatures.procedures.main = p_.command_procedure(
    ($d, $s, $q, $c) => [
        p_.handle_error<d_main.Error, My_Error>(
            [
                p_.refine(

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
                                p_temp.decide.state($, ($) => {
                                    switch ($[0]) {
                                        case 'parse': return p_temp.ss($, ($) => t_bin_to_fountain_pen.Error($))
                                        case 'execute command': return p_temp.ss($, ($) => t_api_to_fountain_pen.Error($))
                                        default: return p_temp.au($[0])
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
