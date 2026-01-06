import * as _p from 'pareto-core-transformer'
import * as _pi from 'pareto-core-interface'

import * as d_in from "../../../../../interface/to_be_generated/is_inside_work_tree"
import * as d_out from "pareto-fountain-pen/dist/interface/generated/pareto/schemas/block/data_types/target"

export type Error = _pi.Transformer<d_in.Error, d_out.Block_Part>

import * as sh from "pareto-fountain-pen/dist/shorthands/block"

import * as t_eqe_to_fountain_pen from "pareto-resources/dist/implementation/manual/schemas/execute_query_executable/transformers/fountain_pen"

export const Error: Error = ($) => _p.sg($, ($) => {
    switch ($[0]) {
        case 'could not run git command': return _p.ss($, ($) => sh.b.sub([
            sh.b.snippet(`could not run git command: `),
            sh.b.snippet($.message)
        ]))
        case 'unexpected output': return _p.ss($, ($) => sh.b.sub([
            sh.b.snippet(`unexpected output from git command: `),
            sh.b.snippet($)
        ]))
        default: return _p.au($[0])
    }
})