import * as _p from 'pareto-core/dist/transformer'
import * as _pi from 'pareto-core/dist/interface'

import * as d_in from "../../../../../interface/to_be_generated/build_and_test"
import * as d_out from "pareto-fountain-pen/dist/interface/generated/liana/schemas/block/data"

import * as sh from "pareto-fountain-pen/dist/shorthands/block"

import * as t_build_to_fountain_pen from "../../build/transformers/fountain_pen"
import * as t_epe_to_fountain_pen from "pareto-resources/dist/implementation/manual/schemas/execute_command_executable/transformers/fountain_pen"

export type Error = _pi.Transformer_With_Parameters<d_in.Error, d_out.Block_Part, { 'concise': boolean }>

export const Error: Error = ($, $p) => _p.decide.state($, ($) => {
    switch ($[0]) {
        case 'error building': return _p.ss($, ($) => t_build_to_fountain_pen.Error($, $p))
        case 'error testing': return _p.ss($, ($) => sh.b.sub([
            sh.b.snippet(`error while testing:`),
            t_epe_to_fountain_pen.Error($),
        ]))
        default: return _p.au($[0])
    }
})