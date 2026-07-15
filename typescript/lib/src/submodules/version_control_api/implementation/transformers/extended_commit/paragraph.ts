import * as p_ from 'pareto-core/implementation/transformer'

//schemas
import type * as s_in from "../../../interface/schemas/extended_commit.js"
import type * as s_out from "../../../interface/schemas/paragraph.js"

namespace declarations {

    export type Error = p_.Transformer<
        s_in.Error,
        s_out.Phrase
    >

}

//shorthands
import * as sh from "pareto-fountain-pen/shorthands/paragraph/deprecated"

//dependencies
import * as t_ece_to_prose from "pareto-resources/implementation/transformers/execute_unrestricted_command_executable/paragraph"

import * as t_git_is_clean_to_prose from "../repository_has_no_open_changes/paragraph.js"

export const Error: declarations.Error = ($) => p_.from.state($).decide(
    ($) => {
        switch ($[0]) {
            case 'asserting no open changes': return p_.option($, ($) => sh.ph.composed([
                sh.ph.text("error while asserting no open changes: "),
                t_git_is_clean_to_prose.Error($)
            ]))
            case 'could not stage': return p_.option($, ($) => sh.ph.composed([
                sh.ph.text("could not stage: "),
                t_ece_to_prose.Error($)
            ]))
            case 'could not commit': return p_.option($, ($) => sh.ph.composed([
                sh.ph.text("could not commit: "),
                t_ece_to_prose.Error($)
            ]))
            case 'could not push': return p_.option($, ($) => sh.ph.composed([
                sh.ph.text("could not push: "),
                t_ece_to_prose.Error($)
            ]))
            default: return p_.exhaustive($[0])
        }
    })