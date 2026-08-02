import * as p_ from 'pareto-core/implementation/transformer'

//schemas
import type * as s_in from "../schema.js"
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
import * as t_git_extended_commit_to_prose from "../../../modules/version_control_api/schemas/extended_commit/transformers/paragraph.js"
import * as t_build_and_validate_to_prose from "../../../schemas/build_and_validate/transformers/paragraph.js"

export const Error: declarations.Error = ($) => p_.from.state($).decide(
    ($) => {
        switch ($[0]) {
            case 'version control extended commit': return p_.option($, ($) => sh.ph.composed([
                t_git_extended_commit_to_prose.Error($)
            ]))
            case 'error while running build and validate': return p_.option($, ($) => sh.ph.composed([
                t_build_and_validate_to_prose.Error($, { 'concise': true })
            ]))
            default: return p_.exhaustive($[0])
        }
    })