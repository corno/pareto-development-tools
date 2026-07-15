import * as p_ from 'pareto-core/implementation/serializer'

//schemas
import type * as s_in from "../../interface/schemas/is_inside_work_tree.js"

namespace declarations {

    export type Error = p_.Phrase_Serializer<
        s_in.Error
    >

}

//shorthands
import * as sh from "pareto-fountain-pen/shorthands/prose_simple/deprecated"

export const Error: declarations.Error = ($) => p_.from.state($).decide(
    ($) => {
        switch ($[0]) {
            case 'could not run git command': return p_.option($, ($) => sh.ph.composed([
                sh.ph.literal("could not run git command: "),
                sh.ph.composed(p_.from.list($.message.lines).map(
                    ($) => sh.ph.literal($)))
            ]))
            case 'unexpected output': return p_.option($, ($) => sh.ph.composed([
                sh.ph.literal("unexpected output from git command: "),
                sh.ph.composed(p_.from.list($.message.lines).map(
                    ($) => sh.ph.literal($)))
            ]))
            default: return p_.exhaustive($[0])
        }
    })