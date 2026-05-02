import * as _p from 'pareto-core/dist/assign'
import * as _pi from 'pareto-core/dist/interface'

import * as d_in from "../../../../interface/to_be_generated/make_pristine"
import * as d_out from "pareto-fountain-pen/dist/interface/generated/liana/schemas/prose/data"

import * as sh from "pareto-fountain-pen/dist/shorthands/prose"

import * as t_epe_to_fountain_pen from "pareto-resources/dist/implementation/manual/transformers/execute_command_executable/fountain_pen"

export type Error = _pi.Transformer<d_in.Error, d_out.Phrase>

export const Error: Error = ($) => _p.decide.state($, ($) => {
    switch ($[0]) {
        case 'unexpected error': return _p.ss($, ($) => sh.ph.composed([
            sh.ph.literal("unexpected error:"),
            t_epe_to_fountain_pen.Error($)
        ]))
        default: return _p.au($[0])
    }
})