import * as p_ from 'pareto-core/dist/implementation/transformer'
import * as p_i from 'pareto-core/dist/interface/transformer'

import * as d_in from "../../../../interface/data/extended_commit"
import * as d_out from "pareto-fountain-pen/dist/interface/generated/liana/schemas/prose/data"

import * as sh from "pareto-fountain-pen/dist/shorthands/prose/deprecated"

export type Error = p_i.Transformer<
d_in.Error, d_out.Phrase
>

import * as t_ece_to_prose from "pareto-resources/dist/implementation/manual/transformers/execute_command_executable/fountain_pen"
import * as t_git_is_clean_to_prose from "../repository_has_no_open_changes/prose"

export const Error: Error = ($) => p_.from.state($).decide(
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
            default: return p_.au($[0])
        }
    })