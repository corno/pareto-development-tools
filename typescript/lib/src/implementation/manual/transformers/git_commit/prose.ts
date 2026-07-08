import * as p_ from 'pareto-core/implementation/transformer'
import * as p_i from 'pareto-core/interface/transformer'

import * as d_in from "../../../../interface/data/git_commit.js"
import * as d_out from "pareto-fountain-pen/interface/generated/liana/schemas/prose/data"

export type Error = p_i.Transformer<
    d_in.Error,
    d_out.Phrase
>

import * as sh from "pareto-fountain-pen/shorthands/prose/deprecated"

import * as t_git_extended_commit_to_prose from "../../../../modules/version_control_api/implementation/manual/transformers/extended_commit/prose.js"
import * as t_build_and_test_to_prose from "../build_and_test/prose.js"

export const Error: Error = ($) => p_.from.state($).decide(
    ($) => {
        switch ($[0]) {
            case 'version control extended commit': return p_.option($, ($) => sh.ph.composed([
                t_git_extended_commit_to_prose.Error($)
            ]))
            case 'error while running build and test': return p_.option($, ($) => sh.ph.composed([
                t_build_and_test_to_prose.Error($, { 'concise': true })
            ]))
            default: return p_.exhaustive($[0])
        }
    })