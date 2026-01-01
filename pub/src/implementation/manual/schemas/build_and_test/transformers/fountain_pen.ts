import * as _pt from 'pareto-core-transformer'
import * as _pi from 'pareto-core-interface'

import * as d_in from "../../../../../interface/to_be_generated/build_and_test"
import * as d_out from "pareto-fountain-pen/dist/interface/generated/pareto/schemas/block/data_types/target"

import * as sh from "pareto-fountain-pen/dist/shorthands/block"

import * as t_build_to_fountain_pen from "../../build/transformers/fountain_pen"
import * as t_epe_to_fountain_pen from "pareto-resources/dist/implementation/manual/schemas/execute_command_executable/transformers/fountain_pen"

export type Error = _pi.Transformer<d_in.Error, d_out.Block_Part>

export const Error: Error = ($) => _pt.cc($, ($) => {
    switch ($[0]) {
        case 'error building': return _pt.ss($, ($) => t_build_to_fountain_pen.Error($))
        case 'error testing': return _pt.ss($, ($) => sh.b.sub([
            sh.b.snippet(`error while testing:`),
            t_epe_to_fountain_pen.Error($),
        ]))
        default: return _pt.au($[0])
    }
})