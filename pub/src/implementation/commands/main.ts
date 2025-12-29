import * as _pc from 'pareto-core-command'
import * as _pt from 'pareto-core-transformer'
import * as _ed from 'pareto-core-dev'

import * as signatures from "../../interface/signatures"

//data types
import * as d from "exupery-resources/dist/interface/to_be_generated/temp_main"

//dependencies
import * as r_instruction from "../refiners/instruction/refiners"
import * as t_api_to_fountain_pen from "../transformers/schemas/api/fountain_pen"
import * as t_bin_to_fountain_pen from "../transformers/schemas/parse/fountain_pen"
import * as s_fp_block from "pareto-fountain-pen/dist/implementation/serializers/schemas/block"

import * as sh from "pareto-fountain-pen/dist/shorthands/block"


export const $$: signatures.commands.main = _pc.create_command_procedure(
    ($p, $cr) => [
        _pc.refine_without_error_transformation(

            // parse command line instruction
            r_instruction.Command($p.arguments).deprecated_transform_error(
                ($): d.Error => {
                    //FIXME: do this properly
                    _ed.log_debug_message(
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
                    return {
                        'exit code': 1
                    }
                }
            ),

            // execute API command
            ($v) => [
                $cr.api.execute(
                    $v,
                    ($): d.Error => {
                        //FIXME: do this properly
                        _ed.log_debug_message(
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
