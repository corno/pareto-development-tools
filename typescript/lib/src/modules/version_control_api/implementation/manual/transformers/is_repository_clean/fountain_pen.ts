import * as p_ from 'pareto-core/dist/implementation/transformer'
import * as p_i from 'pareto-core/dist/interface/transformer'

import * as d_in from "../../../../interface/data/is_repository_clean"
import * as d_out from "pareto-fountain-pen/dist/interface/generated/liana/schemas/prose/data"

export type Error = p_i.Transformer<
    d_in.Error, d_out.Phrase
>

import * as sh from "pareto-fountain-pen/dist/shorthands/prose/deprecated"

import * as t_eqe_to_fountain_pen from "pareto-resources/dist/implementation/manual/transformers/execute_query_executable/fountain_pen"
import * as t_is_inside_work_tree_to_fountain_pen from "../is_inside_work_tree/fountain_pen"

export const Error: Error = ($) => p_.from.state($).decide(
    ($) => {
        switch ($[0]) {
            case 'not a git repository': return p_.ss($, ($) => sh.ph.literal("not a git repository"))
            case 'could not determine git status': return p_.ss($, ($) => sh.ph.composed([
                sh.ph.literal("could not determine git status: "),
                t_eqe_to_fountain_pen.Error($)
            ]))
            case 'unknown issue': return p_.ss($, ($) => sh.ph.composed([
                sh.ph.literal("unknown issue while checking if git is clean: "),
                t_is_inside_work_tree_to_fountain_pen.Error($)
            ]))
            default: return p_.au($[0])
        }
    }
)