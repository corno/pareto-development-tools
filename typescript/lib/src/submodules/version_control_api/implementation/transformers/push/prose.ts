import * as p_ from 'pareto-core/implementation/transformer'
import type * as p_i from 'pareto-core/interface/transformer'

//data types
import type * as s_in from "../../../interface/schemas/push.js"
import type * as s_out from "pareto-fountain-pen/interface/data/prose"

export namespace interface_ {

    export type Error = p_i.Transformer<
        s_in.Error,
        s_out.Phrase
    >
}

//shorthands
import * as sh from "pareto-fountain-pen/shorthands/prose/deprecated"

//dependencies
import * as t_epe_to_prose from "pareto-resources/implementation/transformers/execute_command_executable/prose"


export const Error: interface_.Error = ($) => p_.from.state($).decide(
    ($) => {
        switch ($[0]) {
            case 'could not push': return p_.option($, ($) => sh.ph.composed([
                sh.ph.literal("could not push:"),
                t_epe_to_prose.Error($)
            ]))
            default: return p_.exhaustive($[0])
        }
    })