import * as _pt from 'pareto-core-transformer'
import * as _pi from 'pareto-core-interface'

import * as d_in from "../../../../interface/to_be_generated/build"
import * as d_out from "pareto-fountain-pen/dist/interface/generated/pareto/schemas/block/data_types/target"

export type Error = _pi.Transformer<d_in.Error, d_out.Block_Part>

import * as sh from "pareto-fountain-pen/dist/shorthands/block"

import * as t_tsc_to_fountain_pen from "../tsc/fountain_pen"
import * as t_remove_to_fountain_pen from "exupery-resources/dist/implementation/transformers/schemas/remove/fountain_pen"

export const Error: Error = ($) => _pt.cc($, ($) => {
    switch ($[0]) {
        case 'error building pub': return _pt.ss($, ($) => sh.b.sub([
            sh.b.snippet(`could not build pub: (`),
            sh.b.snippet($.path),
            sh.b.snippet(`/pub)`),
            sh.b.indent([
                sh.g.nested_block([
                    t_tsc_to_fountain_pen.Error($.error)
                ])
            ])
        ]))
        case 'error building test': return _pt.ss($, ($) => sh.b.sub([
            sh.b.snippet(`could not build test: (`),
            sh.b.snippet($.path),
            sh.b.snippet(`/test)`),
            sh.b.indent([
                sh.g.nested_block([
                    t_tsc_to_fountain_pen.Error($.error)
                ])
            ])
        ]))
        case 'error removing pub dist dir': return _pt.ss($, ($) => sh.b.sub([
            sh.b.snippet(`could not remove pub dist dir: (`),
            sh.b.snippet($.path),
            sh.b.snippet(`/pub)`),

            sh.b.indent([
                sh.g.nested_block([
                    t_remove_to_fountain_pen.Error($.error)
                ])
            ])

        ]))
        case 'error removing test dist dir': return _pt.ss($, ($) => sh.b.sub([
            sh.b.snippet(`could not remove test dist dir: (`),
            sh.b.snippet($.path),
            sh.b.snippet(`/test)`),
            sh.b.indent([
                sh.g.nested_block([
                    t_remove_to_fountain_pen.Error($.error)
                ])
            ])
        ]))
        default: return _pt.au($[0])
    }
})