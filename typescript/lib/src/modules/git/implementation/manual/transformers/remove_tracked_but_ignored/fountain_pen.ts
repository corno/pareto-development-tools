import * as p_ from 'pareto-core/dist/implementation/transformer'
import * as p_i from 'pareto-core/dist/interface/transformer'

import * as d_in from "../../../../interface/data/remove_tracked_but_ignored"
import * as d_out from "pareto-fountain-pen/dist/interface/generated/liana/schemas/prose/data"

import * as sh from "pareto-fountain-pen/dist/shorthands/prose/deprecated"

export type Error = p_i.Transformer<
d_in.Error, d_out.Phrase
>

import * as t_git_is_clean_to_fountain_pen from "../is_repository_clean/fountain_pen"
import * as t_ece_to_fountain_pen from "pareto-resources/dist/implementation/manual/transformers/execute_command_executable/fountain_pen"

export const Error: Error = ($) => p_.from.state($).decide(
    ($): d_out.Phrase => {
        switch ($[0]) {
            case 'not clean': return p_.ss($, ($) => sh.ph.literal("the working directory is not clean. Aborting removal of tracked but ignored files."))
            case 'unexpected error': return p_.ss($, ($) => sh.ph.composed([
                sh.ph.literal("unexpected error while checking if git is clean: "),
                t_git_is_clean_to_fountain_pen.Error($)
            ]))
            case 'could not remove': return p_.ss($, ($) => sh.ph.composed([
                sh.ph.literal("could not remove tracked but ignored files: "),
                t_ece_to_fountain_pen.Error($)
            ]))
            case 'could not add': return p_.ss($, ($) => sh.ph.composed([
                sh.ph.literal("could not add tracked but ignored files: "),
                t_ece_to_fountain_pen.Error($)
            ]))
            case 'could not clean': return p_.ss($, ($) => sh.ph.composed([
                sh.ph.literal("could not clean tracked but ignored files: "),
                t_ece_to_fountain_pen.Error($)
            ]))
            default: return p_.au($[0])
        }
    })