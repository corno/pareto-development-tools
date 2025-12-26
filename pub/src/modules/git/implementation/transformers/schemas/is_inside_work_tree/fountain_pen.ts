import * as _ea from 'exupery-core-alg'
import * as _et from 'exupery-core-types'

import * as d_in from "../../../../interface/to_be_generated/is_inside_work_tree"
import * as d_out from "pareto-fountain-pen/dist/interface/generated/pareto/schemas/block/data_types/target"

export type Error = _et.Transformer<d_in.Error, d_out.Block_Part>

import * as sh from "pareto-fountain-pen/dist/shorthands/block"

import * as t_eqe_to_fountain_pen from "exupery-resources/dist/implementation/transformers/schemas/execute_query_executable/fountain_pen"

export const Error: Error = ($) => _ea.cc($, ($) => {
    switch ($[0]) {
        case 'could not run git command': return _ea.ss($, ($) => sh.b.sub([
            sh.b.snippet(`could not run git command: `),
            sh.b.snippet($.message)
        ]))
        case 'unexpected output': return _ea.ss($, ($) => sh.b.sub([
            sh.b.snippet(`unexpected output from git command: `),
            sh.b.snippet($)
        ]))
        default: return _ea.au($[0])
    }
})