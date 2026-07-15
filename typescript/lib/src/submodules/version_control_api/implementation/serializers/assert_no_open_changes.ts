import * as p_ from 'pareto-core/implementation/serializer'

//schemas
import type * as s_in from "../../interface/schemas/assert_no_open_changes.js"

namespace declarations {

    export type Error = p_.Phrase_Serializer<
        s_in.Error
    >

}

//shorthands
import * as sh from "pareto-fountain-pen/shorthands/prose_simple/deprecated"


//dependencies
import * as t_git_is_clean_to_prose from "./repository_has_no_open_changes.js"



export const Error: declarations.Error = ($) => p_.from.state($).decide(
    ($) => {
        switch ($[0]) {
            case 'working directory has open changes': return p_.option($, ($) => sh.ph.composed([
                sh.ph.literal("the working directory has open changes. Aborting operation."),
            ]))
            case 'unexpected error': return p_.option($, ($) => sh.ph.composed([
                sh.ph.literal("unexpected error:"),
                t_git_is_clean_to_prose.Error($)
            ]))
            default: return p_.exhaustive($[0])
        }
    })