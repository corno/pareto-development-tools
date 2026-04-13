import * as _p from 'pareto-core/dist/assign'
import * as _pi from 'pareto-core/dist/interface'

import * as d_in from "../../../../interface/to_be_generated/update_package_dependencies"
import * as d_out from "pareto-fountain-pen/dist/interface/generated/liana/schemas/prose/data"

import * as sh from "pareto-fountain-pen/dist/shorthands/prose"

export type Error = _pi.Transformer<d_in.Error, d_out.Phrase>

import * as t_utd_to_fountain_pen from "../../../../modules/npm/implementation/manual/transformers/update_package_dependencies/fountain_pen"

export const Error: Error = ($) => _p.decide.state($, ($) => {
    switch ($[0]) {
        case 'error updating lib': return _p.ss($, ($) => sh.ph.composed([
            sh.ph.literal("error updating /lib: "),
            t_utd_to_fountain_pen.Error($)
        ]))
        case 'error updating test': return _p.ss($, ($) => sh.ph.composed([
            sh.ph.literal("error updating /test: "),
            t_utd_to_fountain_pen.Error($)
        ]))
        default: return _p.au($[0])
    }
})