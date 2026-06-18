import * as p_ from 'pareto-core/dist/implementation/transformer'
import * as p_i from 'pareto-core/dist/interface/transformer'

import * as d_in from "../../../../interface/data/parse"
import * as d_out from "pareto-fountain-pen/dist/interface/generated/liana/schemas/prose/data"

export type Error = p_i.Transformer<d_in.Error, d_out.Phrase>

import * as sh from "pareto-fountain-pen/dist/shorthands/prose"

export const Error: Error = ($) => p_.from.state($).decide(($) => {
    switch ($[0]) {
        case 'expected one of': return p_.ss($, ($) => sh.ph.composed([
            sh.ph.literal("expected one of: "),
            sh.ph.indent(sh.pg.sentences(p_.from.dictionary(
                $,
            ).convert_to_list(
                ($, id) => sh.sentence([
                    sh.ph.literal(id)
                ])
            ))),

        ]))
        case 'expected a text': return p_.ss($, ($) => sh.ph.composed([
            sh.ph.literal("expected a text: "),
            sh.ph.literal($['description'])
        ]))
        case 'too many arguments': return p_.ss($, ($) => sh.ph.literal("too many arguments"))
        default: return p_.au($[0])
    }
})