import * as _p from 'pareto-core-transformer'
import * as _pi from 'pareto-core-interface'

import * as d_in from "../../../../../interface/to_be_generated/tsc"
import * as d_out from "pareto-fountain-pen/dist/interface/generated/pareto/schemas/block/data"

import * as t_espe_to_fountain_pen from "pareto-resources/dist/implementation/manual/schemas/execute_smelly_command_executable/transformers/fountain_pen"

export type Error = _pi.Transformer_With_Parameters<d_in.Error, d_out.Block_Part, { 'concise': boolean }>

import * as sh from "pareto-fountain-pen/dist/shorthands/block"

export const Error: Error = ($, $p) => _p.sg($, ($): d_out.Block_Part => {
    switch ($[0]) {
        case 'error while running tsc': return _p.ss($, ($) => sh.b.sub([
            sh.b.snippet(`error while running tsc: `),
            $p.concise
                ? sh.b.nothing()
                : t_espe_to_fountain_pen.Error($),
            //
        ]))
        default: return _p.au($[0])
    }
})