import * as pt from 'pareto-core/dist/assign'
import * as pi from 'pareto-core/dist/interface'

import * as d_in from "../../../../interface/to_be_generated/update2latest"
import * as d_out from "pareto-fountain-pen/dist/interface/generated/liana/schemas/prose/data"

export type Error = pi.Transformer<d_in.Error, d_out.Phrase>

import * as sh from "pareto-fountain-pen/dist/shorthands/prose"

import * as t_epe_to_fountain_pen from "pareto-resources/dist/implementation/manual/transformers/execute_command_executable/fountain_pen"

export const Error: Error = ($) => pt.decide.state($, ($) => {
    switch ($[0]) {
        case 'error while running update2latest': return pt.ss($, ($) => sh.ph.composed([
            sh.ph.literal("error while running update2latest: "),
            t_epe_to_fountain_pen.Error($)
        ]))
        default: return pt.au($[0])
    }
})