import * as _ea from 'exupery-core-alg'
import * as _et from 'exupery-core-types'

import * as d_in from "../../../../interface/temp/procedures/commands/tsc"
import * as d_out from "pareto-fountain-pen/dist/interface/generated/pareto/schemas/block/data_types/target"

export type Error = _et.Transformer_Without_Parameters<d_in.Error, d_out.Block_Part>

import * as sh from "pareto-fountain-pen/dist/shorthands/block"

import * as t_espe_to_fountain_pen from "../../../../temp_exupery_resources/transformers/execute_smelly_procedure_executable/fountain_pen"


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