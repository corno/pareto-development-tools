import * as p_ from 'pareto-core/implementation/transformer'
import type * as p_i from 'pareto-core/interface/transformer'

//data types
import type * as d_in from "../../../interface/schemas/assert_no_open_changes.js"
import type * as d_out from "pareto-fountain-pen/interface/data/prose"


export namespace interface_ {

    export type Error = p_i.Transformer<
        d_in.Error,
        d_out.Phrase
    >

}

//shorthands
import * as sh from "pareto-fountain-pen/shorthands/prose/deprecated"


//dependencies
import * as t_git_is_clean_to_prose from "../repository_has_no_open_changes/prose.js"



export const Error: interface_.Error = ($) => p_.from.state($).decide(
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