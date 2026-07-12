import * as p_ from 'pareto-core/implementation/transformer'
import type * as p_i from 'pareto-core/interface/transformer'

//schemas
import type * as s_in from "../../../interface/schemas/repository_no_open_changes.js"
import type * as s_out from "../../../interface/schemas/prose.js"

namespace declarations {
    export type Error = p_i.Transformer<
        s_in.Error,
        s_out.Phrase
    >
}

//shorthands
import * as sh from "pareto-fountain-pen/shorthands/prose/deprecated"

//dependencies
import * as t_eqe_to_prose from "pareto-resources/implementation/transformers/execute_query_executable/prose"
import * as t_is_inside_work_tree_to_prose from "../is_inside_work_tree/prose.js"

export const Error: declarations.Error = ($) => p_.from.state($).decide(
    ($): s_out.Phrase => {
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
            default: return p_.exhaustive($[0])
        }
    })