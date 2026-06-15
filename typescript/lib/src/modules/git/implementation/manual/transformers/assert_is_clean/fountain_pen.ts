import * as pt from 'pareto-core/dist/transformer/implementation'
import * as p_i from 'pareto-core/dist/transformer/interface'

import * as d_in from "../../../../interface/to_be_generated/assert_is_clean"
import * as d_out from "pareto-fountain-pen/dist/interface/generated/liana/schemas/prose/data"

import * as sh from "pareto-fountain-pen/dist/shorthands/prose"

import * as t_git_is_clean_to_fountain_pen from "../is_repository_clean/fountain_pen"

export type Error = p_i.Transformer<d_in.Error, d_out.Phrase>

export const Error: Error = ($) => pt.decide.state($, ($) => {
    switch ($[0]) {
        case 'working directory is not clean': return pt.ss($, ($) => sh.ph.composed([
            sh.ph.literal("working directory not clean"),
        ]))
        case 'unexpected error': return pt.ss($, ($) => sh.ph.composed([
            sh.ph.literal("unexpected error:"),
            t_git_is_clean_to_fountain_pen.Error($)
        ]))
        default: return pt.au($[0])
    }
})