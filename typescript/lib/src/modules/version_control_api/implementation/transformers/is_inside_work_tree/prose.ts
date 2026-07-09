import * as p_ from 'pareto-core/implementation/transformer'
import type * as p_i from 'pareto-core/interface/transformer'

//data types
import type * as d_in from "../../../interface/data/is_inside_work_tree.js"
import type * as d_out from "pareto-fountain-pen/interface/generated/liana/schemas/prose/data"

export namespace interface_ {

    export type Error = p_i.Transformer<
        d_in.Error,
        d_out.Phrase
    >

}

//shorthands
import * as sh from "pareto-fountain-pen/shorthands/prose/deprecated"

export const Error: interface_.Error = ($) => p_.from.state($).decide(
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