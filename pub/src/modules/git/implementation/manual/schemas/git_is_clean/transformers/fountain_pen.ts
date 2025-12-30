import * as _pt from 'pareto-core-transformer'
import * as _pi from 'pareto-core-interface'

import * as d_in from "../../../../../interface/to_be_generated/is_repository_clean"
import * as d_out from "pareto-fountain-pen/dist/interface/generated/pareto/schemas/block/data_types/target"

export type Error = _pi.Transformer<d_in.Error, d_out.Block_Part>

import * as sh from "pareto-fountain-pen/dist/shorthands/block"

import * as t_eqe_to_fountain_pen from "exupery-resources/dist/implementation/transformers/schemas/execute_query_executable/fountain_pen"
import * as t_is_inside_work_tree_to_fountain_pen from "../../is_inside_work_tree/transformers/fountain_pen"

export const Error: Error = ($) => _pt.cc($, ($): d_out.Block_Part => {
    switch ($[0]) {
        case 'not a git repository': return _pt.ss($, ($) => sh.b.snippet(`not a git repository`))
        case 'could not determine git status': return _pt.ss($, ($) => sh.b.sub([
            sh.b.snippet(`could not determine git status: `),
            t_eqe_to_fountain_pen.Error($)
        ]))
        case 'unknown issue': return _pt.ss($, ($) => sh.b.sub([
            sh.b.snippet(`unknown issue while checking if git is clean: `),
            t_is_inside_work_tree_to_fountain_pen.Error($)
        ]))
        default: return _pt.au($[0])
    }
})