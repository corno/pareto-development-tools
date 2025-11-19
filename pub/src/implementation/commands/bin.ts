import * as _easync from 'exupery-core-async'
import * as _ea from 'exupery-core-alg'
import * as _ed from 'exupery-core-dev'

import * as d from "../../interface/commands/bin"

import * as r_instruction from "../refiners/instruction/refiners"

import * as t_api_to_fountain_pen from "../transformers/api/fountain_pen"
import * as t_bin_to_fountain_pen from "../transformers/bin/fountain_pen"
import * as exceptional_fp from "pareto-fountain-pen/dist/exceptional/serialize/block"

import * as sh from "pareto-fountain-pen/dist/shorthands/block"


export const $$: d.Procedure = _easync.create_command_procedure(
    ($p, $cr) => [
        _easync.p.stage(

            // parse command line instruction
            r_instruction.Command($p.arguments).transform_error_temp(
                ($): d.Error => {
                    //FIXME: do this properly
                    _ed.log_debug_message(
                        exceptional_fp.Group(
                            sh.group([sh.g.nested_block([
                                t_bin_to_fountain_pen.Parse_Error($)
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
                            exceptional_fp.Group(
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
