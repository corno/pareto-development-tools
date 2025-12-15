import * as _ea from 'exupery-core-alg'
import * as _et from 'exupery-core-types'

import * as d_in from "../../../interface/commands/build"
import * as d_out from "pareto-fountain-pen/dist/interface/generated/pareto/schemas/block/data_types/target"

export type Error = _et.Transformer<d_out.Block_Part, d_in.Error>

import * as sh from "pareto-fountain-pen/dist/shorthands/block"

import * as t_tsc_to_fountain_pen from "../tsc/fountain_pen"
import * as t_remove_to_fountain_pen from "exupery-resources/dist/implementation/transformers/remove/fountain_pen"

export const Error: Error = ($) => _ea.cc($, ($) => {
    switch ($[0]) {
        case 'error building pub': return _ea.ss($, ($) => sh.b.sub([
            sh.b.snippet(`could not build pub: `),
            sh.b.indent([
                sh.g.nested_block([
                    t_tsc_to_fountain_pen.Error($)
                ])
            ])
        ]))
        case 'error building test': return _ea.ss($, ($) => sh.b.sub([
            sh.b.snippet(`could not build test: `),
            sh.b.indent([
                sh.g.nested_block([
                    t_tsc_to_fountain_pen.Error($)
                ])
            ])
        ]))
        case 'error removing pub dist dir': return _ea.ss($, ($) => sh.b.sub([
            sh.b.snippet(`could not remove pub dist dir: `),

            sh.b.indent([
                sh.g.nested_block([
                    t_remove_to_fountain_pen.Error($)
                ])
            ])

        ]))
        case 'error removing test dist dir': return _ea.ss($, ($) => sh.b.sub([
            sh.b.snippet(`could not remove test dist dir: `),

            sh.b.indent([
                sh.g.nested_block([
                    t_remove_to_fountain_pen.Error($)
                ])
            ])
        ]))
        default: return _ea.au($[0])
    }
})