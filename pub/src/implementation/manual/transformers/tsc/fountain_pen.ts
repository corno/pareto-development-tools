import * as _p from 'pareto-core/dist/assign'
import * as _pi from 'pareto-core/dist/interface'

import * as d_in from "../../../../interface/to_be_generated/tsc"
import * as d_out from "pareto-fountain-pen/dist/interface/generated/liana/schemas/prose/data"

import * as t_espe_to_fountain_pen from "pareto-resources/dist/implementation/manual/schemas/execute_smelly_command_executable/transformers/fountain_pen"

export type Error = _pi.Transformer_With_Parameter<d_in.Error, d_out.Paragraph, { 'concise': boolean }>

import * as sh from "pareto-fountain-pen/dist/shorthands/prose"

export const Error: Error = ($, $p) => _p.decide.state($, ($): d_out.Paragraph => {
    switch ($[0]) {
        case 'error while running tsc': return _p.ss($, ($) => $p.concise
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
        default: return _p.au($[0])
    }
})