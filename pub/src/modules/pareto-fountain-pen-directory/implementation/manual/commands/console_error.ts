import * as _pi from 'pareto-core-interface'
import * as _p from 'pareto-core-command'

import * as signatures from "../../../interface/signatures"

//dependencies
import * as t_block_to_lines from "pareto-fountain-pen/dist/implementation/manual/schemas/block/transformers/lines"

export const $$: signatures.commands.console_error = _p.create_command_procedure(
    ($p, $cr) => [
        $cr['log error'].execute(
            {
                'lines': t_block_to_lines.Group(
                    $p.group,
                    {
                        'indentation': $p.indentation
                    }
                )
            },
            ($) => $,
        )
    ]
)