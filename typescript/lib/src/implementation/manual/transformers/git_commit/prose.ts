import * as p_ from 'pareto-core/implementation/transformer'

import type * as interface_ from "../../../../interface/declarations/transformers/git_commit/prose.js"

//shorthands
import * as sh from "pareto-fountain-pen/shorthands/prose/deprecated"

//dependencies
import * as t_git_extended_commit_to_prose from "../../../../modules/version_control_api/implementation/manual/transformers/extended_commit/prose.js"
import * as t_build_and_test_to_prose from "../build_and_test/prose.js"

export const Error: interface_.Error = ($) => p_.from.state($).decide(
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