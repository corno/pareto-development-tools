import * as p_ from 'pareto-core/implementation/transformer'
import * as p_i from 'pareto-core/interface/transformer'

import * as d_in from "../../../../interface/data/repository_no_open_changes.js"
import * as d_out from "pareto-fountain-pen/interface/generated/liana/schemas/prose/data"

export type Error = p_i.Transformer<
    d_in.Error,
    d_out.Phrase
>

import * as sh from "pareto-fountain-pen/shorthands/prose/deprecated"

import * as t_eqe_to_prose from "pareto-resources/implementation/manual/transformers/execute_query_executable/prose"
import * as t_is_inside_work_tree_to_prose from "../is_inside_work_tree/prose.js"

export const Error: Error = ($) => p_.from.state($).decide(
    ($): d_out.Phrase => {
        switch ($[0]) {
            case 'not a repository': return p_.option($, ($) => sh.ph.literal("not a repository"))
            case 'could not determine status': return p_.option($, ($) => sh.ph.composed([
                sh.ph.literal("could not determine git status: "),
                t_eqe_to_prose.Error($)
            ]))
            case 'unknown issue': return p_.option($, ($) => sh.ph.composed([
                sh.ph.literal("unknown issue while checking if git is clean: "),
                t_is_inside_work_tree_to_prose.Error($)
            ]))
            default: return p_.au($[0])
        }
    })