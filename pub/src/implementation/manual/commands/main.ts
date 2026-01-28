import * as _p from 'pareto-core/dist/command'
import * as _pt from 'pareto-core/dist/transformer'

import * as signatures from "../../../interface/signatures"

//data types
import * as d from "pareto-resources/dist/interface/to_be_generated/temp_main"
import * as d_parse from "../../../interface/to_be_generated/parse"
import * as d_api from "../../../interface/to_be_generated/execute_command"

//dependencies
import * as r_instruction from "../schemas/execute_command/refiners/main"
import * as t_api_to_fountain_pen from "../schemas/execute_command/transformers/fountain_pen"
import * as t_bin_to_fountain_pen from "../schemas/parse/transformers/fountain_pen"
import * as s_fp_block from "pareto-fountain-pen/dist/implementation/manual/schemas/block/serializers"

import * as sh from "pareto-fountain-pen/dist/shorthands/block"


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
                        'lines': _p.list.literal([
                            _p.decide.state($, ($) => {
                                switch ($[0]) {
                                    case 'parse': return _p.ss($, ($) => s_fp_block.Group(
                                        sh.group([sh.g.nested_block([
                                            t_bin_to_fountain_pen.Error($)
                                        ])]),
                                        {
                                            'indentation': `    `,
                                            'newline': `\n`,
                                        }
                                    ))
                                    case 'api': return _p.ss($, ($) => s_fp_block.Group(
                                        sh.group([sh.g.nested_block([
                                            t_api_to_fountain_pen.Error($)
                                        ])]),
                                        {
                                            'indentation': `    `,
                                            'newline': `\n`,
                                        }
                                    ))
                                    default: return _p.au($[0])
                                }
                            })
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
