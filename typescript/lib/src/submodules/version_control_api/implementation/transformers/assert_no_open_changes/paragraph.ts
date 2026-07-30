import * as p_ from 'pareto-core/implementation/transformer'

//schemas
import type * as s_in from "../../../interface/schemas/assert_no_open_changes.js"
import type * as s_out from "../../../interface/schemas/paragraph.js"

namespace declarations {

    export type Error = p_.Transformer<
        s_in.Error,
        s_out.Phrase
    >

}

//shorthands
import * as sh from "pareto-fountain-pen/modules/paragraph/shorthands/deprecated"


//dependencies
import * as t_git_is_clean_to_prose from "../repository_has_no_open_changes/paragraph.js"



export const Error: declarations.Error = ($) => p_.from.state($).decide(
    ($) => {
        switch ($[0]) {
            case 'working directory has open changes': return p_.option($, ($) => sh.ph.composed([
                sh.ph.text("the working directory has open changes. Aborting operation."),
            ]))
            case 'unexpected error': return p_.option($, ($) => sh.ph.composed([
                sh.ph.text("unexpected error:"),
                t_git_is_clean_to_prose.Error($)
            ]))
            default: return p_.exhaustive($[0])
        }
    })