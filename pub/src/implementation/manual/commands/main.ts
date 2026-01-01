import * as _p from 'pareto-core-command'
import * as _pt from 'pareto-core-transformer'
import * as _pdev from 'pareto-core-dev'

import * as signatures from "../../../interface/signatures"

//data types
import * as d from "pareto-resources/dist/interface/to_be_generated/temp_main"

//dependencies
import * as r_instruction from "../schemas/api/refiners/main"
import * as t_api_to_fountain_pen from "../schemas/api/transformers/fountain_pen"
import * as t_bin_to_fountain_pen from "../schemas/parse/transformers/fountain_pen"
import * as s_fp_block from "pareto-fountain-pen/dist/implementation/manual/schemas/block/serializers"

import * as sh from "pareto-fountain-pen/dist/shorthands/block"


export const $$: signatures.commands.main = _p.create_command_procedure(
    ($p, $cr) => [
        _p.refine_without_error_transformation(

            // parse command line instruction
            (abort) => r_instruction.Command(
                $p,
                ($) => {
                    //FIXME: do this properly
                    _pdev.log_debug_message(
                        s_fp_block.Group(
                            sh.group([sh.g.nested_block([
                                t_bin_to_fountain_pen.Error($)
                            ])]),
                            {
                                'indentation': `    `,
                                'newline': `\n`,
                            }
                        ),
                        () => { }
                    )
                    return abort({
                        'exit code': 1
                    })
                }
            ),

            // execute API command
            ($v) => [
                $cr.api.execute(
                    $v,
                    ($): d.Error => {
                        //FIXME: do this properly
                        _pdev.log_debug_message(
                            s_fp_block.Group(
                                sh.group([sh.g.nested_block([
                                    t_api_to_fountain_pen.Error($)
                                ])]),
                                {
                                    'indentation': `    `,
                                    'newline': `\n`,
                                }
                            ),
                            () => { }
                        )
                        return ({
                            'exit code': 0
                        })
                    },
                )
            ],
        )
    ]
)
