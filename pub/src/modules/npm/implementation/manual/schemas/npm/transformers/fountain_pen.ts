import * as _p from 'pareto-core-transformer'
import * as _pi from 'pareto-core-interface'

import * as d_in from "../../../../../interface/to_be_generated/npm"
import * as d_out from "pareto-fountain-pen/dist/interface/generated/pareto/schemas/block/data_types/target"

export type Error = _pi.Transformer<d_in.Error, d_out.Block_Part>

import * as sh from "pareto-fountain-pen/dist/shorthands/block"

import * as t_epe_to_fountain_pen from "pareto-resources/dist/implementation/manual/schemas/execute_command_executable/transformers/fountain_pen"


export const Error: Error = ($) => {
    return _p.cc($, ($): d_out.Block_Part => {
        switch ($[0]) {
            case 'error while running npm': return _p.ss($, ($) => sh.b.sub([
                sh.b.snippet(`error while running npm: `),
                t_epe_to_fountain_pen.Error($)
            ]))
            default: return _p.au($[0])
        }
    })
}