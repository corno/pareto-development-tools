import * as _ea from 'exupery-core-alg'
import * as _et from 'exupery-core-types'

import * as d_in from "../../../interface/algorithms/queries/git_is_clean"
import * as d_out from "pareto-fountain-pen/dist/interface/generated/pareto/schemas/block/data_types/target"

export type Error = _et.Transformer<d_out.Block_Part, d_in.Error>

import * as sh from "pareto-fountain-pen/dist/shorthands/block"

import * as t_eqe_to_fountain_pen from "exupery-resources/dist/implementation/transformers/execute_query_executable/fountain_pen"
import * as t_is_inside_work_tree_to_fountain_pen from "../is_inside_work_tree/fountain_pen"

export const Error: Error = ($) => _ea.cc($, ($): d_out.Block_Part => {
    switch ($[0]) {
        case 'not a git repository': return _ea.ss($, ($) => sh.b.snippet(`not a git repository`))
        case 'could not determine git status': return _ea.ss($, ($) => sh.b.sub([
            sh.b.snippet(`could not determine git status: `),
            t_eqe_to_fountain_pen.Error($)
        ]))
        case 'unknown issue': return _ea.ss($, ($) => sh.b.sub([
            sh.b.snippet(`unknown issue while checking if git is clean: `),
            t_is_inside_work_tree_to_fountain_pen.Error($)
        ]))
        default: return _ea.au($[0])
    }
})