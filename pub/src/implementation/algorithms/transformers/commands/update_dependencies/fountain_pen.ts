import * as _ea from 'exupery-core-alg'
import * as _et from 'exupery-core-types'

import * as d_in from "../../../../../interface/temp/procedures/commands/update_dependencies"
import * as d_out from "pareto-fountain-pen/dist/interface/generated/pareto/schemas/block/data_types/target"

import * as sh from "pareto-fountain-pen/dist/shorthands/block"

export type Error = _et.Transformer_Without_Parameters<d_in.Error, d_out.Block_Part>

import * as t_utd_to_fountain_pen from "../update_typescript_dependencies/fountain_pen"

export const Error: Error = ($) => _ea.cc($, ($) => {
    switch ($[0]) {
        case 'error updating pub': return _ea.ss($, ($) => sh.b.sub([
            sh.b.snippet(`error updating /pub: `),
            t_utd_to_fountain_pen.Error($)
        ]))
        case 'error updating test': return _ea.ss($, ($) => sh.b.sub([
            sh.b.snippet(`error updating /test: `),
            t_utd_to_fountain_pen.Error($)
        ]))
        default: return _ea.au($[0])
    }
})