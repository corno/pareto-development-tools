import * as pt from 'pareto-core/dist/implementation/transformer'
import * as p_i from 'pareto-core/dist/interface/transformer'

import * as d_in from "../../../../interface/to_be_generated/build_and_test"
import * as d_out from "pareto-fountain-pen/dist/interface/generated/liana/schemas/prose/data"

import * as sh from "pareto-fountain-pen/dist/shorthands/prose"

import * as t_build_to_fountain_pen from "../build/fountain_pen"
import * as t_epe_to_fountain_pen from "pareto-resources/dist/implementation/manual/transformers/execute_command_executable/fountain_pen"

export type Error = p_i.Transformer_With_Parameter<d_in.Error, d_out.Phrase, { 'concise': boolean }>

export const Error: Error = ($, $p) => pt.decide.state($, ($) => {
    switch ($[0]) {
        case 'error building': return pt.ss($, ($) => t_build_to_fountain_pen.Error($, $p))
        case 'error testing': return pt.ss($, ($) => sh.ph.composed([
            sh.ph.literal("error while testing:"),
            t_epe_to_fountain_pen.Error($),
        ]))
        default: return pt.au($[0])
    }
})