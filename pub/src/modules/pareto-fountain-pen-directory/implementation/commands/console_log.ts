import * as _et from 'exupery-core-types'
import * as _easync from 'exupery-core-async'

import * as _in from "pareto-fountain-pen/dist/interface/generated/pareto/schemas/block/data_types/target"

import * as t_block_to_lines from "pareto-fountain-pen/dist/implementation/algorithms/transformations/block/lines"

// import { Signature } from "../../../interface/algorithms/procedures/guaranteed/console_log"

import * as d_log from "exupery-resources/dist/interface/generated/pareto/schemas/log/data_types/source"


export type Parameters = {
    'group': _in.Group,
    'indentation': string,
}

export type Query_Resources = null

export type Command_Resources = {
    'log': _et.Command<null, d_log.Parameters>
}

export const $$: _et.Command_Procedure<_et.Command<null, Parameters>, Command_Resources, Query_Resources> = _easync.create_command_procedure(
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