import * as _p from 'pareto-core/dist/assign'
import * as _pi from 'pareto-core/dist/interface'

import * as d_in from "../../../../../interface/to_be_generated/parse"
import * as d_out from "pareto-fountain-pen/dist/interface/generated/liana/schemas/block/data"

export type Error = _pi.Transformer<d_in.Error, d_out.Phrase>

import * as sh from "pareto-fountain-pen/dist/shorthands/block"

export const Error: Error = ($) => _p.decide.state($, ($) => {
    switch ($[0]) {
        case 'expected one of': return _p.ss($, ($) => sh.ph.composed([
            sh.ph.literal("expected one of: "),
            sh.ph.indent(sh.pg.sentences(_p.list.from.dictionary(
                $,
            ).convert(
                ($, id) => sh.sentence([
                    sh.ph.literal(id)
                ])
            ))),

        ]))
        case 'expected a text': return _p.ss($, ($) => sh.ph.composed([
            sh.ph.literal("expected a text: "),
            sh.ph.literal($['description'])
        ]))
        case 'too many arguments': return _p.ss($, ($) => sh.ph.literal("too many arguments"))
        default: return _p.au($[0])
    }
})