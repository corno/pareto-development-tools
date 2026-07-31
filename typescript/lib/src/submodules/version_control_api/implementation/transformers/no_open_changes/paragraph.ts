import * as p_ from 'pareto-core/implementation/transformer'

//schemas
import type * as s_in from "../../../schemas/repository_no_open_changes.js"
import type * as s_out from "pareto-fountain-pen/modules/paragraph/schemas/paragraph/schema"

namespace declarations {

    export type Error = p_.Transformer<
        s_in.Error,
        s_out.Phrase
    >
}

//shorthands
import * as sh from "pareto-fountain-pen/modules/paragraph/schemas/paragraph/shorthands/deprecated"

//dependencies
import * as t_eqe_to_prose from "pareto-resources/schemas/execute_sandboxed_query_executable/transformers/paragraph"
import * as t_is_inside_work_tree_to_prose from "../is_inside_work_tree/paragraph.js"

export const Error: declarations.Error = ($) => p_.from.state($).decide(
    ($) => {
        switch ($[0]) {
            case 'not a repository': return p_.option($, ($) => sh.ph.text("not a repository"))
            case 'could not determine status': return p_.option($, ($) => sh.ph.composed([
                sh.ph.text("could not determine git status: "),
                t_eqe_to_prose.Error($)
            ]))
            case 'unknown issue': return p_.option($, ($) => sh.ph.composed([
                sh.ph.text("unknown issue while checking if git is clean: "),
                t_is_inside_work_tree_to_prose.Error($)
            ]))
            default: return p_.exhaustive($[0])
        }
    }
)