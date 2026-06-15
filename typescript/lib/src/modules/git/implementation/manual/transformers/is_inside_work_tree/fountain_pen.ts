import * as pt from 'pareto-core/dist/transformer/implementation'
import * as p_i from 'pareto-core/dist/transformer/interface'

import * as d_in from "../../../../interface/to_be_generated/is_inside_work_tree"
import * as d_out from "pareto-fountain-pen/dist/interface/generated/liana/schemas/prose/data"

export type Error = p_i.Transformer<d_in.Error, d_out.Phrase>

import * as sh from "pareto-fountain-pen/dist/shorthands/prose"

export const Error: Error = ($) => pt.decide.state($, ($) => {
    switch ($[0]) {
        case 'could not run git command': return pt.ss($, ($) => sh.ph.composed([
            sh.ph.literal("could not run git command: "),
            sh.ph.composed($.message.lines.__l_map(($) => sh.ph.literal($)))
        ]))
        case 'unexpected output': return pt.ss($, ($) => sh.ph.composed([
            sh.ph.literal("unexpected output from git command: "),
            sh.ph.composed($.lines.__l_map(($) => sh.ph.literal($)))
        ]))
        default: return pt.au($[0])
    }
})