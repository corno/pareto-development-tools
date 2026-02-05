import * as _pi from 'pareto-core/dist/interface'
import * as _p from 'pareto-core/dist/command'

import * as signatures from "../../../interface/signatures"

//dependencies
import * as t_block_to_lines from "pareto-fountain-pen/dist/implementation/manual/schemas/block/transformers/lines"

export const $$: signatures.commands.console_error = _p.command_procedure(
    ($p, $cr) => [
        $cr['log error'].execute(
            {
                'message': $p.paragraph,
            },
            ($) => $,
        )
    ]
)