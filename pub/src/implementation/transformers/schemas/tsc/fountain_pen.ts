import * as _ea from 'exupery-core-alg'
import * as _et from 'exupery-core-types'

import * as d_in from "../../../../interface/to_be_generated/tsc"
import * as d_out from "pareto-fountain-pen/dist/interface/generated/pareto/schemas/block/data_types/target"

export type Error = _et.Transformer<d_in.Error, d_out.Block_Part>

import * as sh from "pareto-fountain-pen/dist/shorthands/block"

export const Error: Error = ($) => {
    return _ea.cc($, ($): d_out.Block_Part => {
        switch ($[0]) {
            case 'error while running tsc': return _ea.ss($, ($) => sh.b.sub([
                sh.b.snippet(`error while running tsc: `),
                //t_espe_to_fountain_pen.Error($)
            ]))
            default: return _ea.au($[0])
        }
    })
}