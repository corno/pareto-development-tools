import * as _ea from 'exupery-core-alg'
import * as _et from 'exupery-core-types'

import * as d_in from "../../../../../interface/temp/procedures/commands/build"
import * as d_out from "pareto-fountain-pen/dist/interface/generated/pareto/schemas/block/data_types/target"

export type Error = _et.Transformer_Without_Parameters<d_in.Error, d_out.Block_Part>

import * as sh from "pareto-fountain-pen/dist/shorthands/block"

import * as t_tsc_to_fountain_pen from "../tsc/fountain_pen"

export const Error: Error = ($) => _ea.cc($, ($) => {
    switch ($[0]) {
        case 'error building pub': return _ea.ss($, ($) => sh.b.sub([
            sh.b.snippet(`could not build pub: `),
            t_tsc_to_fountain_pen.Error($)
        ]))
        case 'error building test': return _ea.ss($, ($) => sh.b.sub([
            sh.b.snippet(`could not build test: `),
            t_tsc_to_fountain_pen.Error($)
        ]))
        default: return _ea.au($[0])
    }
})