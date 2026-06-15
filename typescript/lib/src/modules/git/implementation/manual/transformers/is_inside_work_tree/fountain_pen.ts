import * as p_ from 'pareto-core/dist/implementation/transformer'
import * as p_i from 'pareto-core/dist/interface/transformer'

import * as d_in from "../../../../interface/data/is_inside_work_tree"
import * as d_out from "pareto-fountain-pen/dist/interface/generated/liana/schemas/prose/data"

export type Error = p_i.Transformer<d_in.Error, d_out.Phrase>

import * as sh from "pareto-fountain-pen/dist/shorthands/prose"

export const Error: Error = ($) => p_.decide.state($, ($) => {
    switch ($[0]) {
        case 'could not run git command': return p_.ss($, ($) => sh.ph.composed([
            sh.ph.literal("could not run git command: "),
            sh.ph.composed($.message.lines.__l_map(($) => sh.ph.literal($)))
        ]))
        case 'unexpected output': return p_.ss($, ($) => sh.ph.composed([
            sh.ph.literal("unexpected output from git command: "),
            sh.ph.composed($.lines.__l_map(($) => sh.ph.literal($)))
        ]))
        default: return p_.au($[0])
    }
})