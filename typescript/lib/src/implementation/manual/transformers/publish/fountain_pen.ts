import * as p_ from 'pareto-core/dist/implementation/transformer'
import * as p_i from 'pareto-core/dist/interface/transformer'

import * as d_in from "../../../../interface/data/publish"
import * as d_out from "pareto-fountain-pen/dist/interface/generated/liana/schemas/prose/data"

import * as sh from "pareto-fountain-pen/dist/shorthands/prose/deprecated"

export type Error = p_i.Transformer<
d_in.Error, d_out.Phrase
>

import * as t_git_push_to_fountain_pen from "../../../../modules/git/implementation/manual/transformers/push/fountain_pen"
import * as t_git_assert_is_clean_to_fountain_pen from "../../../../modules/git/implementation/manual/transformers/assert_is_clean/fountain_pen"
import * as t_git_make_pristine_to_fountain_pen from "../../../../modules/git/implementation/manual/transformers/make_pristine/fountain_pen"
import * as t_clean_and_update_package_dependencies_to_fountain_pen from "../update_package_dependencies/fountain_pen"
import * as t_git_is_clean_to_fountain_pen from "../../../../modules/git/implementation/manual/transformers/is_repository_clean/fountain_pen"
import * as t_npm_to_fountain_pen from "../../../../modules/npm/implementation/manual/transformers/npm/fountain_pen"
import * as t_build_and_test_to_fountain_pen from "../build_and_test/fountain_pen"
import * as t_get_package_json_to_fountain_pen from "../../../../modules/npm/implementation/manual/transformers/get_package_json/fountain_pen"
import * as t_git_ec_to_fountain_pen from "../../../../modules/git/implementation/manual/transformers/extended_commit/fountain_pen"

export const Error: Error = ($) => p_.from.state($).decide(
    ($) => {
        switch ($[0]) {
            case 'error while running git push': return p_.ss($, ($) => sh.ph.composed([
                t_git_push_to_fountain_pen.Error($)
            ]))
            case 'error while running git assert is clean at the start': return p_.ss($, ($) => sh.ph.composed([
                p_.from.state($).decide(
                    ($) => {
                        switch ($[0]) {
                            case 'unexpected error': return p_.ss($, ($) => t_git_is_clean_to_fountain_pen.Error($))
                            case 'working directory is not clean': return p_.ss($, ($) => sh.ph.literal("working directory is not clean at the start"))
                            default: return p_.au($[0])
                        }
                    })
            ]))
            case 'error while running git make pristine': return p_.ss($, ($) => sh.ph.composed([
                t_git_make_pristine_to_fountain_pen.Error($)
            ]))
            case 'error while running update package dependencies': return p_.ss($, ($) => sh.ph.composed([
                t_clean_and_update_package_dependencies_to_fountain_pen.Error($)
            ]))
            case 'error while running build and test': return p_.ss($, ($) => t_build_and_test_to_fountain_pen.Error($, { 'concise': false }))
            case 'error while running git assert is clean after updating package dependencies': return p_.ss($, ($) => sh.ph.composed([
                p_.from.state($).decide(
                    ($) => {
                        switch ($[0]) {
                            case 'unexpected error': return p_.ss($, ($) => t_git_is_clean_to_fountain_pen.Error($))
                            case 'working directory is not clean': return p_.ss($, ($) => sh.ph.literal("working directory is not clean after updating package dependencies"))
                            default: return p_.au($[0])
                        }
                    })
            ]))
            case 'error while running npm version': return p_.ss($, ($) => sh.ph.composed([
                sh.ph.literal("could not increment version: "),
                t_npm_to_fountain_pen.Error($)
            ]))
            case 'error while running npm update': return p_.ss($, ($) => sh.ph.composed([
                sh.ph.literal("could not update npm: "),
                t_npm_to_fountain_pen.Error($)
            ]))
            case 'error while running npm publish': return p_.ss($, ($) => sh.ph.composed([
                sh.ph.literal("could not publish to npm: "),
                t_npm_to_fountain_pen.Error($)
            ]))
            case 'error while logging': return p_.ss($, ($) => sh.ph.composed([
                sh.ph.literal("could not log"),
            ]))
            case 'error while getting package.json': return p_.ss($, ($) => sh.ph.composed([
                sh.ph.literal("could not read package.json: "),
                t_get_package_json_to_fountain_pen.Error($)
            ]))
            case 'error while running git extended commit': return p_.ss($, ($) => sh.ph.composed([
                sh.ph.literal("could not commit and push: "),
                t_git_ec_to_fountain_pen.Error($)
            ]))

            default: return p_.au($[0])
        }
    })