import * as p_ from 'pareto-core/implementation/serializer'

//schemas
import type * as s_in from "../../interface/schemas/git_commit.js"

namespace declarations {
    export type Error = p_.Phrase_Serializer<
        s_in.Error
    >
}

//shorthands
import * as sh from "pareto-fountain-pen/shorthands/prose_simple/deprecated"

//dependencies
import * as t_git_extended_commit_to_prose from "../../submodules/version_control_api/implementation/serializers/extended_commit.js"
import * as t_build_and_test_to_prose from "./build_and_test.js"

export const Error: declarations.Error = ($) => p_.from.state($).decide(
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