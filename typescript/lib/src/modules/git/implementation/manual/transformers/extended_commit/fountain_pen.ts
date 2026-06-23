import * as p_ from 'pareto-core/dist/implementation/transformer'
import * as p_i from 'pareto-core/dist/interface/transformer'

import * as d_in from "../../../../interface/data/extended_commit"
import * as d_out from "pareto-fountain-pen/dist/interface/generated/liana/schemas/prose/data"

import * as sh from "pareto-fountain-pen/dist/shorthands/prose"

export type Error = p_i.Transformer<
d_in.Error, d_out.Phrase
>

import * as t_ece_to_fountain_pen from "pareto-resources/dist/implementation/manual/transformers/execute_command_executable/fountain_pen"
import * as t_git_is_clean_to_fountain_pen from "../is_repository_clean/fountain_pen"

export const Error: Error = ($) => p_.from.state($).decide(
    ($): d_out.Phrase => {
        switch ($[0]) {
            case 'asserting git not clean': return p_.ss($, ($) => sh.ph.composed([
                sh.ph.literal("error while asserting git is not clean: "),
                t_git_is_clean_to_fountain_pen.Error($)
            ]))
            case 'could not stage': return p_.ss($, ($) => sh.ph.composed([
                sh.ph.literal("could not stage: "),
                t_ece_to_fountain_pen.Error($)
            ]))
            case 'could not commit': return p_.ss($, ($) => sh.ph.composed([
                sh.ph.literal("could not commit: "),
                t_ece_to_fountain_pen.Error($)
            ]))
            case 'could not push': return p_.ss($, ($) => sh.ph.composed([
                sh.ph.literal("could not push: "),
                t_ece_to_fountain_pen.Error($)
            ]))
            default: return p_.au($[0])
        }
    })