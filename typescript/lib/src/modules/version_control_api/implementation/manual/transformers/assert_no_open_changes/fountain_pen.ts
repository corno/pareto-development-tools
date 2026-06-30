import * as p_ from 'pareto-core/dist/implementation/transformer'
import * as p_i from 'pareto-core/dist/interface/transformer'

import * as d_in from "../../../../interface/data/assert_no_open_changes"
import * as d_out from "pareto-fountain-pen/dist/interface/generated/liana/schemas/prose/data"

import * as sh from "pareto-fountain-pen/dist/shorthands/prose/deprecated"

import * as t_git_is_clean_to_fountain_pen from "../repository_has_no_open_changes/fountain_pen"

export type Error = p_i.Transformer<
d_in.Error, d_out.Phrase
>

export const Error: Error = ($) => p_.from.state($).decide(
    ($) => {
        switch ($[0]) {
            case 'working directory has open changes': return p_.option($, ($) => sh.ph.composed([
                sh.ph.literal("the working directory has open changes. Aborting operation."),
            ]))
            case 'unexpected error': return p_.option($, ($) => sh.ph.composed([
                sh.ph.literal("unexpected error:"),
                t_git_is_clean_to_fountain_pen.Error($)
            ]))
            default: return p_.au($[0])
        }
    })