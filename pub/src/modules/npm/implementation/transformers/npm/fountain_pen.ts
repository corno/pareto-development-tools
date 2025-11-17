import * as _ea from 'exupery-core-alg'
import * as _et from 'exupery-core-types'

import * as d_in from "../../../interface/npm"
import * as d_out from "pareto-fountain-pen/dist/interface/generated/pareto/schemas/block/data_types/target"

export type Error = _et.Transformer_Without_Parameters<d_in.Error, d_out.Block_Part>

import * as sh from "pareto-fountain-pen/dist/shorthands/block"

import * as t_epe_to_fountain_pen from "exupery-resources/dist/implementation/transformers/execute_procedure_executable/fountain_pen"


export const Error: Error = ($) => {
    return _ea.cc($, ($): d_out.Block_Part => {
        switch ($[0]) {
            case 'error while running npm': return _ea.ss($, ($) => sh.b.sub([
                sh.b.snippet(`error while running npm: `),
                t_epe_to_fountain_pen.Error($)
            ]))
            default: return _ea.au($[0])
        }
    })
}