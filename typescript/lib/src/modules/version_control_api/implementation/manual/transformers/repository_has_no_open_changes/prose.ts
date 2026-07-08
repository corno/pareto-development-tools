import * as p_ from 'pareto-core/implementation/transformer'
import type * as p_i from 'pareto-core/interface/transformer'

//data types
import type * as d_in from "../../../../interface/data/repository_no_open_changes.js"
import type * as d_out from "pareto-fountain-pen/interface/generated/liana/schemas/prose/data"

export namespace interface_ {

    export type Error = p_i.Transformer<
        d_in.Error, d_out.Phrase
    >
}

//shorthands
import * as sh from "pareto-fountain-pen/shorthands/prose/deprecated"

//dependencies
import * as t_eqe_to_prose from "pareto-resources/implementation/manual/transformers/execute_query_executable/prose"
import * as t_is_inside_work_tree_to_prose from "../is_inside_work_tree/prose.js"

export const Error: interface_.Error = ($) => p_.from.state($).decide(
    ($) => {
        switch ($[0]) {
            case 'not a repository': return p_.option($, ($) => sh.ph.literal("not a repository"))
            case 'could not determine status': return p_.option($, ($) => sh.ph.composed([
                sh.ph.literal("could not determine status: "),
                t_eqe_to_prose.Error($)
            ]))
            case 'unknown issue': return p_.option($, ($) => sh.ph.composed([
                sh.ph.literal("unknown issue while checking if repository has no open changes: "),
                t_is_inside_work_tree_to_prose.Error($)
            ]))
            default: return p_.exhaustive($[0])
        }
    }
)