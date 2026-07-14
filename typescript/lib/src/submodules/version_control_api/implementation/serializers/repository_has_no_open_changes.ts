import * as p_ from 'pareto-core/implementation/serializer'

//schemas
import type * as s_in from "../../interface/schemas/repository_no_open_changes.js"

namespace declarations {

    export type Error = p_.Phrase_Serializer<
        s_in.Error
    >
}

//shorthands
import * as sh from "pareto-fountain-pen/shorthands/prose/deprecated"

//dependencies
import * as t_eqe_to_prose from "pareto-resources/implementation/serializers/execute_query_executable"
import * as t_is_inside_work_tree_to_prose from "./is_inside_work_tree.js"

export const Error: declarations.Error = ($) => p_.from.state($).decide(
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