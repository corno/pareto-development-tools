import * as pt from 'pareto-core/dist/transformer/implementation'
import * as p_ti from 'pareto-core/dist/transformer/interface'

import * as d_in from "../../../../interface/to_be_generated/update_package_dependencies"
import * as d_out from "pareto-fountain-pen/dist/interface/generated/liana/schemas/prose/data"

import * as sh from "pareto-fountain-pen/dist/shorthands/prose"

export type Error = p_ti.Transformer<d_in.Error, d_out.Phrase>

//dependencies
import * as t_stat_possible_node_to_fountain_pen from "pareto-resources/dist/implementation/manual/transformers/stat_possible_node/fountain_pen"
import * as t_utd_to_fountain_pen from "../../../../modules/npm/implementation/manual/transformers/update_package_dependencies/fountain_pen"

export const Error: Error = ($) => pt.decide.state($, ($) => {
    switch ($[0]) {
        case 'error updating lib': return pt.ss($, ($) => sh.ph.composed([
            sh.ph.literal("error updating /lib: "),
            t_utd_to_fountain_pen.Error($)
        ]))
        case 'error updating test': return pt.ss($, ($) => sh.ph.composed([
            sh.ph.literal("error updating /test: "),
            t_utd_to_fountain_pen.Error($)
        ]))
        case 'error updating app': return pt.ss($, ($) => sh.ph.composed([
            sh.ph.literal("error updating /app: "),
            t_utd_to_fountain_pen.Error($)
        ]))
        case 'error statting app dir': return pt.ss($, ($) => sh.ph.composed([
            sh.ph.literal("error statting /app directory: "),
            t_stat_possible_node_to_fountain_pen.Error($)
        ]))
        default: return pt.au($[0])
    }
})