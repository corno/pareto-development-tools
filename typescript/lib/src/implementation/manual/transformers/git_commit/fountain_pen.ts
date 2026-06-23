import * as p_ from 'pareto-core/dist/implementation/transformer'
import * as p_i from 'pareto-core/dist/interface/transformer'

import * as d_in from "../../../../interface/data/git_commit"
import * as d_out from "pareto-fountain-pen/dist/interface/generated/liana/schemas/prose/data"

export type Error = p_i.Transformer<
d_in.Error, d_out.Phrase
>

import * as sh from "pareto-fountain-pen/dist/shorthands/prose"

import * as t_git_extended_commit_to_fountain_pen from "../../../../modules/git/implementation/manual/transformers/extended_commit/fountain_pen"
import * as t_build_and_test_to_fountain_pen from "../build_and_test/fountain_pen"

export const Error: Error = ($) => p_.from.state($).decide(
    ($) => {
        switch ($[0]) {
            case 'git extended commit': return p_.ss($, ($) => sh.ph.composed([
                t_git_extended_commit_to_fountain_pen.Error($)
            ]))
            case 'error while running build and test': return p_.ss($, ($) => sh.ph.composed([
                t_build_and_test_to_fountain_pen.Error($, { 'concise': true })
            ]))
            default: return p_.au($[0])
        }
    })