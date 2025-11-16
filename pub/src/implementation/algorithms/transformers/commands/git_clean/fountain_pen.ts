import * as _ea from 'exupery-core-alg'
import * as _et from 'exupery-core-types'

import * as d_in from "../../../../../interface/temp/procedures/commands/git_clean"
import * as d_out from "pareto-fountain-pen/dist/interface/generated/pareto/schemas/block/data_types/target"

import * as sh from "pareto-fountain-pen/dist/shorthands/block"

import * as t_epe_to_fountain_pen from "../../temp_exupery_resources/execute_procedure_executable/fountain_pen"

export type Error = _et.Transformer_Without_Parameters<d_in.Error, d_out.Block_Part>

export const Error: Error = ($) => _ea.cc($, ($) => {
    switch ($[0]) {
        case 'unexpected error': return _ea.ss($, ($) => sh.b.sub([
            sh.b.snippet(`unexpected error:`),
            t_epe_to_fountain_pen.Error($)
        ]))
        default: return _ea.au($[0])
    }
})