import * as p_ from 'pareto-core/implementation/command'
import * as p_temp from 'pareto-core/implementation/transformer'

//interface dependencies
import type * as command_interfaces from "../../interface/commands.js"
import type * as command_interfaces_pareto_application_api from "pareto-application-api/interface/commands"
import type * as command_interfaces_pareto_stream_api from "pareto-stream-api/interface/commands"


//schemas
import type * as s_main from "./main.js"
import type * as s_application_api_main from "../../interface/schemas/application_api_main.js"
import type * as s_parse from "../../interface/schemas/parse.js"
import type * as s_execute_command from "../../interface/schemas/execute_command.js"

//dependencies
import * as r_instruction from "../refiners/execute_command/main.js"
import * as t_api_to_prose from "../transformers/execute_command/prose.js"
import * as t_bin_to_prose from "../transformers/parse/prose.js"

//shorthands
import * as sh from "pareto-fountain-pen/shorthands/prose/deprecated"


type My_Error =
    | ['parse', s_parse.Error]
    | ['execute command', s_execute_command.Error]

export const $$: p_.Command_Implementation<
    command_interfaces_pareto_application_api.main,
    null,
    null,
    {
        'api': command_interfaces.api
        'log error': command_interfaces_pareto_stream_api.log_error

    }
> = p_.command(
    ($d, $s, $q, $c) => [
        p_.s.handle_error<s_application_api_main.Error, My_Error>(
            [
                p_.s.refine(

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
                                p_temp.from.state($).decide(
                                    ($) => {
                                        switch ($[0]) {
                                            case 'parse': return p_temp.ss($, ($) => t_bin_to_prose.Error($))
                                            case 'execute command': return p_temp.ss($, ($) => t_api_to_prose.Error($))
                                            default: return p_temp.exhaustive($[0])
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
