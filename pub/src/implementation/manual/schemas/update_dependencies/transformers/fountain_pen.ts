import * as _p from 'pareto-core-transformer'
import * as _pi from 'pareto-core-interface'

import * as d_in from "../../../../../interface/to_be_generated/update_dependencies"
import * as d_out from "pareto-fountain-pen/dist/interface/generated/pareto/schemas/block/data_types/target"

import * as sh from "pareto-fountain-pen/dist/shorthands/block"

export type Error = _pi.Transformer<d_in.Error, d_out.Block_Part>

import * as t_utd_to_fountain_pen from "../../clean_and_update_dependencies/transformers/fountain_pen"

export const Error: Error = ($) => _p.cc($, ($) => {
    switch ($[0]) {
        case 'error updating pub': return _p.ss($, ($) => sh.b.sub([
            sh.b.snippet(`error updating /pub: `),
            t_utd_to_fountain_pen.Error($)
        ]))
        case 'error updating test': return _p.ss($, ($) => sh.b.sub([
            sh.b.snippet(`error updating /test: `),
            t_utd_to_fountain_pen.Error($)
        ]))
        default: return _p.au($[0])
    }
})