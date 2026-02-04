import * as _p from 'pareto-core/dist/expression'
import * as _pi from 'pareto-core/dist/interface'

import * as d_in from "../../../../../interface/to_be_generated/build"
import * as d_out from "pareto-fountain-pen/dist/interface/generated/liana/schemas/block/data"

export namespace signatures {
    export type Error = _pi.Transformer_With_Parameters<d_in.Error, d_out.Block_Part, { 'concise': boolean }>
}

//shorthands
import * as sh from "pareto-fountain-pen/dist/shorthands/block"

//dependencies
import * as t_tsc_to_fountain_pen from "../../tsc/transformers/fountain_pen"
import * as t_remove_to_fountain_pen from "pareto-resources/dist/implementation/manual/schemas/remove/transformers/fountain_pen"
import * as t_path_to_text from "pareto-resources/dist/implementation/manual/schemas/path/transformers/text"

export const Error: signatures.Error = ($, $p) => _p.decide.state($, ($) => {
    switch ($[0]) {
        case 'error removing pub dist dir': return _p.ss($, ($) => sh.b.sub([
            sh.b.literal("could not remove pub dist dir: ("),
            sh.b.text(t_path_to_text.Context_Path($.path)),
            sh.b.literal("/pub)"),

            sh.b.indent([
                sh.g.nested_block([
                    t_remove_to_fountain_pen.Error($.error)
                ])
            ])

        ]))
        case 'error removing test dist dir': return _p.ss($, ($) => sh.b.sub([
            sh.b.literal("could not remove test dist dir: ("),
            sh.b.text(t_path_to_text.Context_Path($.path)),
            sh.b.literal("/test)"),
            sh.b.indent([
                sh.g.nested_block([
                    t_remove_to_fountain_pen.Error($.error)
                ])
            ])
        ]))
        case 'error building pub': return _p.ss($, ($) => sh.b.sub([
            sh.b.literal("could not build pub: ("),
            sh.b.text(t_path_to_text.Context_Path($.path)),
            sh.b.literal(")"),
            sh.b.indent([
                sh.g.nested_block([
                    t_tsc_to_fountain_pen.Error($.error, $p)
                ])
            ])
        ]))
        case 'error building test': return _p.ss($, ($) => sh.b.sub([
            sh.b.literal("could not build test: ("),
            sh.b.text(t_path_to_text.Context_Path($.path)),
            sh.b.literal(")"),
            sh.b.indent([
                sh.g.nested_block([
                    t_tsc_to_fountain_pen.Error($.error, $p)
                ])
            ])
        ]))
        default: return _p.au($[0])
    }
})