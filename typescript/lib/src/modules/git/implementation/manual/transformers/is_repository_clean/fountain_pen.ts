import * as _p from 'pareto-core/dist/assign'
import * as _pi from 'pareto-core/dist/interface'

import * as d_in from "../../../../interface/to_be_generated/is_repository_clean"
import * as d_out from "pareto-fountain-pen/dist/interface/generated/liana/schemas/prose/data"

export type Error = _pi.Transformer<d_in.Error, d_out.Phrase>

import * as sh from "pareto-fountain-pen/dist/shorthands/prose"

import * as t_eqe_to_fountain_pen from "pareto-resources/dist/implementation/manual/transformers/execute_query_executable/fountain_pen"
import * as t_is_inside_work_tree_to_fountain_pen from "../is_inside_work_tree/fountain_pen"

export const Error: Error = ($) => _p.decide.state($, ($): d_out.Phrase => {
    switch ($[0]) {
        case 'not a git repository': return _p.ss($, ($) => sh.ph.literal("not a git repository"))
        case 'could not determine git status': return _p.ss($, ($) => sh.ph.composed([
            sh.ph.literal("could not determine git status: "),
            t_eqe_to_fountain_pen.Error($)
        ]))
        case 'unknown issue': return _p.ss($, ($) => sh.ph.composed([
            sh.ph.literal("unknown issue while checking if git is clean: "),
            t_is_inside_work_tree_to_fountain_pen.Error($)
        ]))
        default: return _p.au($[0])
    }
})