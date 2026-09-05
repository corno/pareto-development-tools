import * as p_ from 'pareto-core/command'
import * as p_temp from 'pareto-core/transformer'

//interface dependencies
import type * as command_interfaces from "../interfaces.js"
import type * as command_interfaces_pareto_application_api from "pareto-application-api/commands/interfaces"
import type * as command_interfaces_pareto_stream_api from "pareto-stream-api/commands/interfaces"


//schemas
import type * as s_application_api_main from "pareto-application-api/schemas/main/schema"
import type * as s_parse from "../../schemas/parse/schema.js"
import type * as s_command_error from "../../schemas/command_error/schema.js"

//dependencies
import * as r_instruction from "../../schemas/command_instruction/refiners/main.js"
import * as t_api_to_paragraph from "../../schemas/command_error/transformers/paragraph.js"
import * as t_bin_to_paragraph from "../../schemas/parse/transformers/paragraph.js"
import * as t_paragraph_to_serialized from "pareto-fountain-pen/modules/paragraph/schemas/paragraph/transformers/serialized"



export const $$: p_.Command_Implementation<
    command_interfaces_pareto_application_api.main,
    {
        'indentation': string
    },
    null,
    {
        'api': command_interfaces.api
        'log error lines': command_interfaces_pareto_stream_api.log_error_lines

    }
> = p_.command(
    ($d, $s, $q, $c) => [
        p_.s.handle_error<
            s_application_api_main.Error,
            | ['parse', s_parse.Error]
            | ['execute command', s_command_error.Error]
        >(
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

                $c['log error lines'].execute(
                    {
                        'lines': t_paragraph_to_serialized.Phrase(
                            p_temp.from.state($).decide(
                                ($) => {
                                    switch ($[0]) {
                                        case 'parse': return p_temp.option($, ($) => t_bin_to_paragraph.Error($))
                                        case 'execute command': return p_temp.option($, ($) => t_api_to_paragraph.Error($))
                                        default: return p_temp.exhaustive($[0])
                                    }
                                }
                            ),
                            {
                                'indentation': $s.indentation,
                            },
                        ),
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
