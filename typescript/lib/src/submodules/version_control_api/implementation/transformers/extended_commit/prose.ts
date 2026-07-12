import * as p_ from 'pareto-core/implementation/transformer'
import type * as p_i from 'pareto-core/interface/transformer'

//schemas
import type * as s_in from "../../../interface/schemas/extended_commit.js"
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
import * as t_ece_to_prose from "pareto-resources/implementation/transformers/execute_command_executable/prose"
import * as t_git_is_clean_to_prose from "../repository_has_no_open_changes/prose.js"

export const Error: interface_.Error = ($) => p_.from.state($).decide(
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