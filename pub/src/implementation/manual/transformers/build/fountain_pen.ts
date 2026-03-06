import * as _p from 'pareto-core/dist/assign'
import * as _pi from 'pareto-core/dist/interface'

import * as d_in from "../../../../interface/to_be_generated/build"
import * as d_out from "pareto-fountain-pen/dist/interface/generated/liana/schemas/prose/data"

export namespace signatures {
    export type Error = _pi.Transformer_With_Parameter<d_in.Error, d_out.Phrase, { 'concise': boolean }>
}

//shorthands
import * as sh from "pareto-fountain-pen/dist/shorthands/prose"

//dependencies
import * as t_tsc_to_fountain_pen from "../tsc/fountain_pen"
import * as t_remove_to_fountain_pen from "pareto-resources/dist/implementation/manual/transformers/remove/fountain_pen"
import * as t_path_to_text from "pareto-resources/dist/implementation/manual/transformers/path/list_of_characters"

export const Error: signatures.Error = ($, $p) => _p.decide.state($, ($) => {
    switch ($[0]) {
        case 'error removing pub dist dir': return _p.ss($, ($) => sh.ph.composed([
            sh.ph.literal("could not remove pub dist dir: ("),
            sh.ph.serialize(t_path_to_text.Context_Path($.path)),
            sh.ph.literal("/pub)"),

            sh.ph.indent(
                sh.pg.sentences([
                    sh.sentence([
                        t_remove_to_fountain_pen.Error($.error)
                    ])
                ])
            )

        ]))
        case 'error removing test dist dir': return _p.ss($, ($) => sh.ph.composed([
            sh.ph.literal("could not remove test dist dir: ("),
            sh.ph.serialize(t_path_to_text.Context_Path($.path)),
            sh.ph.literal("/test)"),
            sh.ph.indent(
                sh.pg.sentences([
                    sh.sentence([
                        t_remove_to_fountain_pen.Error($.error)
                    ])
                ])
            )
        ]))
        case 'error building pub': return _p.ss($, ($) => sh.ph.composed([
            sh.ph.literal("could not build pub: ("),
            sh.ph.serialize(t_path_to_text.Context_Path($.path)),
            sh.ph.literal(")"),
            sh.ph.indent(
                t_tsc_to_fountain_pen.Error($.error, $p)
            )
        ]))
        case 'error building test': return _p.ss($, ($) => sh.ph.composed([
            sh.ph.literal("could not build test: ("),
            sh.ph.serialize(t_path_to_text.Context_Path($.path)),
            sh.ph.literal(")"),
            sh.ph.indent(
                t_tsc_to_fountain_pen.Error($.error, $p)
            )
        ]))
        default: return _p.au($[0])
    }
})