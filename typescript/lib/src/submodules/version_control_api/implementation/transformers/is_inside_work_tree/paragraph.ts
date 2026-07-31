import * as p_ from 'pareto-core/implementation/transformer'

//schemas
import type * as s_in from "../../../schemas/is_inside_work_tree.js"
import type * as s_out from "pareto-fountain-pen/modules/paragraph/schemas/paragraph/schema"

namespace declarations {

    export type Error = p_.Transformer<
        s_in.Error,
        s_out.Phrase
    >

}

//shorthands
import * as sh from "pareto-fountain-pen/modules/paragraph/schemas/paragraph/shorthands/deprecated"

export const Error: declarations.Error = ($) => p_.from.state($).decide(
    ($) => {
        switch ($[0]) {
            case 'could not run git command': return p_.option($, ($) => sh.ph.composed([
                sh.ph.text("could not run git command: "),
                sh.ph.composed(p_.from.list($.message.lines).map(
                    ($) => sh.ph.text($)))
            ]))
            case 'unexpected output': return p_.option($, ($) => sh.ph.composed([
                sh.ph.text("unexpected output from git command: "),
                sh.ph.composed(p_.from.list($.message.lines).map(
                    ($) => sh.ph.text($)))
            ]))
            default: return p_.exhaustive($[0])
        }
    })