import * as _ea from 'exupery-core-alg'
import * as _et from 'exupery-core-types'

import * as d_in from "../../../interface/algorithms/commands/build_and_test"
import * as d_out from "pareto-fountain-pen/dist/interface/generated/pareto/schemas/block/data_types/target"

import * as sh from "pareto-fountain-pen/dist/shorthands/block"

import * as t_build_to_fountain_pen from "../build/fountain_pen"
import * as t_epe_to_fountain_pen from "exupery-resources/dist/implementation/transformers/execute_procedure_executable/fountain_pen"

export type Error = _et.Transformer<d_in.Error, d_out.Block_Part>

export const Error: Error = ($) => _ea.cc($, ($) => {
    switch ($[0]) {
        case 'error building': return _ea.ss($, ($) => t_build_to_fountain_pen.Error($))
        case 'error testing': return _ea.ss($, ($) => sh.b.sub([
            sh.b.snippet(`error while testing:`),
            t_epe_to_fountain_pen.Error($),
        ]))
        default: return _ea.au($[0])
    }
})