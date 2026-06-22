import * as p_ from 'pareto-core/dist/implementation/transformer'
import * as p_i from 'pareto-core/dist/interface/transformer'

import * as d_in from "../../../../interface/data/npm_tool"
import * as d_out from "pareto-fountain-pen/dist/interface/generated/liana/schemas/prose/data"

export type Error = p_i.Transformer<d_in.Error, d_out.Phrase>

import * as sh from "pareto-fountain-pen/dist/shorthands/prose"

import * as t_epe_to_fountain_pen from "pareto-resources/dist/implementation/manual/transformers/execute_command_executable/fountain_pen"


export const Error: Error = ($) => p_.from.state($).decide(
    ($): d_out.Phrase => {
        switch ($[0]) {
            case 'error while running npm': return p_.ss($, ($) => sh.ph.composed([
                sh.ph.literal("error while running npm: "),
                t_epe_to_fountain_pen.Error($)
            ]))
            default: return p_.au($[0])
        }
    })