import * as p_ from 'pareto-core/implementation/serializer'

//schemas
import type * as s_in from "../../interface/schemas/extended_commit.js"

namespace declarations {

    export type Error = p_.Phrase_Serializer<
        s_in.Error
    >

}

//shorthands
import * as sh from "pareto-fountain-pen/shorthands/prose_simple/deprecated"

//dependencies
import * as t_ece_to_prose from "pareto-resources/implementation/serializers/execute_command_executable"

import * as t_git_is_clean_to_prose from "./repository_has_no_open_changes.js"

export const Error: declarations.Error = ($) => p_.from.state($).decide(
    ($) => {
        switch ($[0]) {
            case 'asserting no open changes': return p_.option($, ($) => sh.ph.composed([
                sh.ph.literal("error while asserting no open changes: "),
                t_git_is_clean_to_prose.Error($)
            ]))
            case 'could not stage': return p_.option($, ($) => sh.ph.composed([
                sh.ph.literal("could not stage: "),
                t_ece_to_prose.Error($)
            ]))
            case 'could not commit': return p_.option($, ($) => sh.ph.composed([
                sh.ph.literal("could not commit: "),
                t_ece_to_prose.Error($)
            ]))
            case 'could not push': return p_.option($, ($) => sh.ph.composed([
                sh.ph.literal("could not push: "),
                t_ece_to_prose.Error($)
            ]))
            default: return p_.exhaustive($[0])
        }
    })