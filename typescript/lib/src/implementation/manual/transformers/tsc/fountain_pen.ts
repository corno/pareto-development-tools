import * as pt from 'pareto-core/dist/assign'
import * as pi from 'pareto-core/dist/interface'

import * as d_in from "../../../../interface/to_be_generated/tsc"
import * as d_out from "pareto-fountain-pen/dist/interface/generated/liana/schemas/prose/data"

import * as t_espe_to_fountain_pen from "pareto-resources/dist/implementation/manual/transformers/execute_smelly_command_executable/fountain_pen"

export type Error = pi.Transformer_With_Parameter<d_in.Error, d_out.Paragraph, { 'concise': boolean }>

import * as sh from "pareto-fountain-pen/dist/shorthands/prose"

export const Error: Error = ($, $p) => pt.decide.state($, ($): d_out.Paragraph => {
    switch ($[0]) {
        case 'error while running tsc': return pt.ss($, ($) => $p.concise
            ? sh.pg.composed([])
            : sh.pg.sentences([
                sh.sentence([
                    sh.ph.literal("error while running tsc: "),
                ]),
                sh.sentence([
                    t_espe_to_fountain_pen.Error($),
                ]),
                //
            ])
        )
        default: return pt.au($[0])
    }
})