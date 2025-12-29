import * as _pt from 'pareto-core-transformer'
import * as _pi from 'pareto-core-interface'

import * as d_in from "../../../../interface/to_be_generated/clean"
import * as d_out from "pareto-fountain-pen/dist/interface/generated/pareto/schemas/block/data_types/target"

import * as sh from "pareto-fountain-pen/dist/shorthands/block"

import * as t_epe_to_fountain_pen from "exupery-resources/dist/implementation/transformers/schemas/execute_procedure_executable/fountain_pen"

export type Error = _pi.Transformer<d_in.Error, d_out.Block_Part>

export const Error: Error = ($) => _pt.cc($, ($) => {
    switch ($[0]) {
        case 'unexpected error': return _pt.ss($, ($) => sh.b.sub([
            sh.b.snippet(`unexpected error:`),
            t_epe_to_fountain_pen.Error($)
        ]))
        default: return _pt.au($[0])
    }
})