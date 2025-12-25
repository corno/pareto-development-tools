import * as _et from 'exupery-core-types'
import * as _easync from 'exupery-core-async'

import * as signatures from "../../interface/signatures"

//dependencies
import * as t_block_to_lines from "pareto-fountain-pen/dist/implementation/transformers/schemas/block/lines"

export const $$: signatures.commands.console_log = _easync.create_command_procedure(
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