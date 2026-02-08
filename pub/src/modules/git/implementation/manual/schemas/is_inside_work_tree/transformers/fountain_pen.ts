import * as _p from 'pareto-core/dist/assign'
import * as _pi from 'pareto-core/dist/interface'

import * as d_in from "../../../../../interface/to_be_generated/is_inside_work_tree"
import * as d_out from "pareto-fountain-pen/dist/interface/generated/liana/schemas/block/data"

export type Error = _pi.Transformer<d_in.Error, d_out.Phrase>

import * as sh from "pareto-fountain-pen/dist/shorthands/block"

export const Error: Error = ($) => _p.decide.state($, ($) => {
    switch ($[0]) {
        case 'could not run git command': return _p.ss($, ($) => sh.ph.composed([
            sh.ph.literal("could not run git command: "),
            sh.ph.indent($.message.paragraph)
        ]))
        case 'unexpected output': return _p.ss($, ($) => sh.ph.composed([
            sh.ph.literal("unexpected output from git command: "),
            sh.ph.indent($.paragraph)
        ]))
        default: return _p.au($[0])
    }
})