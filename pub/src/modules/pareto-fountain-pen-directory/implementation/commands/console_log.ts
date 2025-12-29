import * as _pi from 'pareto-core-interface'
import * as _pc from 'pareto-core-command'

import * as signatures from "../../interface/signatures"

//dependencies
import * as t_block_to_lines from "pareto-fountain-pen/dist/implementation/transformers/schemas/block/lines"

export const $$: signatures.commands.console_log = _pc.create_command_procedure(
    ($p, $cr) => [
        $cr['log'].execute(
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