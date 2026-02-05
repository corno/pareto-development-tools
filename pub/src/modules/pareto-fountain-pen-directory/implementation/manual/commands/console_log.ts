import * as _pi from 'pareto-core/dist/interface'
import * as _p from 'pareto-core/dist/command'

import * as signatures from "../../../interface/signatures"

//dependencies
import * as t_block_to_lines from "pareto-fountain-pen/dist/implementation/manual/schemas/block/transformers/lines"

//shorthands
import * as sh from "pareto-fountain-pen/dist/shorthands/block"

export const $$: signatures.commands.console_log = _p.command_procedure(
    ($p, $cr) => [
        $cr['log'].execute(
            {
                'message': $p.paragraph
            },
            ($) => $,
        )
    ]
)