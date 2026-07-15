import * as p_ from 'pareto-core/implementation/serializer'

//schemas
import type * as s_in from "../../interface/schemas/publish.js"

namespace declarations {
    export type Error = p_.Phrase_Serializer<
        s_in.Error
    >
}

//shorthands
import * as sh from "pareto-fountain-pen/shorthands/prose_simple/deprecated"

//dependencies
import * as t_git_push_to_prose from "../../submodules/version_control_api/implementation/serializers/push.js"
import * as t_git_make_pristine_to_prose from "../../submodules/version_control_api/implementation/serializers/make_pristine.js"
import * as t_clean_and_update_package_dependencies_to_prose from "./update_package_dependencies.js"
import * as t_git_is_clean_to_prose from "../../submodules/version_control_api/implementation/serializers/repository_has_no_open_changes.js"
import * as t_npm_to_prose from "../../submodules/npm/implementation/serializers/npm.js"
import * as t_build_and_test_to_prose from "./build_and_test.js"
import * as t_get_package_json_to_prose from "../../submodules/npm/implementation/serializers/get_package_json.js"
import * as t_git_ec_to_prose from "../../submodules/version_control_api/implementation/serializers/extended_commit.js"

export const Error: declarations.Error = ($) => p_.from.state($).decide(
    ($) => {
        switch ($[0]) {
            case 'error while running git push': return p_.option($, ($) => sh.ph.composed([
                t_git_push_to_prose.Error($)
            ]))
            case 'error while running git assert no open changes at the start': return p_.option($, ($) => sh.ph.composed([
                p_.from.state($).decide(
                    ($) => {
                        switch ($[0]) {
                            case 'unexpected error': return p_.option($, ($) => t_git_is_clean_to_prose.Error($))
                            case 'working directory has open changes': return p_.option($, ($) => sh.ph.literal("working directory has open changes at the start"))
                            default: return p_.exhaustive($[0])
                        }
                    })
            ]))
            case 'error while running git make pristine': return p_.option($, ($) => sh.ph.composed([
                t_git_make_pristine_to_prose.Error($)
            ]))
            case 'error while running update package dependencies': return p_.option($, ($) => sh.ph.composed([
                t_clean_and_update_package_dependencies_to_prose.Error($)
            ]))
            case 'error while running build and test': return p_.option($, ($) => t_build_and_test_to_prose.Error($, { 'concise': false }))
            case 'error while running git assert no open changes after updating package dependencies': return p_.option($, ($) => sh.ph.composed([
                p_.from.state($).decide(
                    ($) => {
                        switch ($[0]) {
                            case 'unexpected error': return p_.option($, ($) => t_git_is_clean_to_prose.Error($))
                            case 'working directory has open changes': return p_.option($, ($) => sh.ph.literal("working directory has open changes after updating package dependencies"))
                            default: return p_.exhaustive($[0])
                        }
                    })
            ]))
            case 'error while running npm version': return p_.option($, ($) => sh.ph.composed([
                sh.ph.literal("could not increment version: "),
                t_npm_to_prose.Error($)
            ]))
            case 'error while running npm update': return p_.option($, ($) => sh.ph.composed([
                sh.ph.literal("could not update npm: "),
                t_npm_to_prose.Error($)
            ]))
            case 'error while running npm publish': return p_.option($, ($) => sh.ph.composed([
                sh.ph.literal("could not publish to npm: "),
                t_npm_to_prose.Error($)
            ]))
            case 'error while logging': return p_.option($, ($) => sh.ph.composed([
                sh.ph.literal("could not log"),
            ]))
            case 'error while getting package.json': return p_.option($, ($) => sh.ph.composed([
                sh.ph.literal("could not read package.json: "),
                t_get_package_json_to_prose.Error($)
            ]))
            case 'error while running git extended commit': return p_.option($, ($) => sh.ph.composed([
                sh.ph.literal("could not commit and push: "),
                t_git_ec_to_prose.Error($)
            ]))

            default: return p_.exhaustive($[0])
        }
    })