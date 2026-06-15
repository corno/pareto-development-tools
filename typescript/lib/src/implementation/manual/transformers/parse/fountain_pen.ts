import * as pt from 'pareto-core/dist/transformer/implementation'
import * as p_i from 'pareto-core/dist/transformer/interface'

import * as d_in from "../../../../interface/to_be_generated/parse"
import * as d_out from "pareto-fountain-pen/dist/interface/generated/liana/schemas/prose/data"

export type Error = p_i.Transformer<d_in.Error, d_out.Phrase>

import * as sh from "pareto-fountain-pen/dist/shorthands/prose"

export const Error: Error = ($) => pt.decide.state($, ($) => {
    switch ($[0]) {
        case 'expected one of': return pt.ss($, ($) => sh.ph.composed([
            sh.ph.literal("expected one of: "),
            sh.ph.indent(sh.pg.sentences(pt.list.from.dictionary(
                $,
            ).convert(
                ($, id) => sh.sentence([
                    sh.ph.literal(id)
                ])
            ))),

        ]))
        case 'expected a text': return pt.ss($, ($) => sh.ph.composed([
            sh.ph.literal("expected a text: "),
            sh.ph.literal($['description'])
        ]))
        case 'too many arguments': return pt.ss($, ($) => sh.ph.literal("too many arguments"))
        default: return pt.au($[0])
    }
})