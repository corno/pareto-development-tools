import * as p_ from 'pareto-core/implementation/transformer'
import type * as p_i from 'pareto-core/interface/transformer'

//schemas
import type * as s_in from "../../../interface/schemas/is_inside_work_tree.js"

import type * as s_out from "../../../interface/schemas/prose.js"
namespace declarations {

    export type Error = p_i.Transformer<
        s_in.Error,
        s_out.Phrase
    >

}

//shorthands
import * as sh from "pareto-fountain-pen/shorthands/prose/deprecated"

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
                sh.ph.composed(p_.from.list($.lines).map(
                    ($) => sh.ph.literal($)))
            ]))
            default: return p_.exhaustive($[0])
        }
    })