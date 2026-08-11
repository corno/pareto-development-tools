import * as p_ from 'pareto-core/implementation/transformer'

//schemas
import type * as s_in from "../schema.js"
import type * as s_out from "pareto-fountain-pen/modules/paragraph/schemas/paragraph/schema"

namespace declarations {
    export type Error = p_.Transformer_With_Parameter<
        s_in.Error,
        s_out.Phrase,
        {
            'context path': string
        }
    >
}

//shorthands
import * as sh from "pareto-fountain-pen/modules/paragraph/schemas/paragraph/shorthands/deprecated"

//dependencies
import * as t_git_push_to_paragraph from "../../../modules/version_control_api/schemas/push/transformers/paragraph.js"
import * as t_git_make_pristine_to_paragraph from "../../../modules/version_control_api/schemas/make_pristine/transformers/paragraph.js"
import * as t_clean_and_update_package_dependencies_to_paragraph from "../../../schemas/update_package_dependencies/transformers/paragraph.js"
import * as t_git_is_clean_to_paragraph from "../../../modules/version_control_api/schemas/repository_no_open_changes/transformers/paragraph.js"
import * as t_npm_to_paragraph from "../../../modules/npm/schemas/npm_tool/transformers/paragraph.js"
import * as t_build_and_validate_to_paragraph from "../../../schemas/build_and_validate/transformers/paragraph.js"
import * as t_get_package_json_to_paragraph from "../../../modules/npm/schemas/get_package_json/transformers/paragraph.js"
import * as t_git_ec_to_paragraph from "../../../modules/version_control_api/schemas/extended_commit/transformers/paragraph.js"

export const Error: declarations.Error = ($, $p) => p_.from.state($).decide(
    ($) => {
        switch ($[0]) {
            case 'error while running git push': return p_.option($, ($) => sh.ph.composed([
                t_git_push_to_paragraph.Error($)
            ]))
            case 'error while running git assert no open changes at the start': return p_.option($, ($) => sh.ph.composed([
                p_.from.state($).decide(
                    ($) => {
                        switch ($[0]) {
                            case 'unexpected error': return p_.option($, ($) => t_git_is_clean_to_paragraph.Error($))
                            case 'working directory has open changes': return p_.option($, ($) => sh.ph.text("working directory has open changes at the start"))
                            default: return p_.exhaustive($[0])
                        }
                    })
            ]))
            case 'error while running git make pristine': return p_.option($, ($) => sh.ph.composed([
                t_git_make_pristine_to_paragraph.Error($)
            ]))
            case 'error while running update package dependencies': return p_.option($, ($) => sh.ph.composed([
                t_clean_and_update_package_dependencies_to_paragraph.Error($)
            ]))
            case 'error while running build and validate': return p_.option($, ($) => t_build_and_validate_to_paragraph.Error($, { 'concise': false, 'context path': $p['context path'] }))
            case 'error while running git assert no open changes after updating package dependencies': return p_.option($, ($) => sh.ph.composed([
                p_.from.state($).decide(
                    ($) => {
                        switch ($[0]) {
                            case 'unexpected error': return p_.option($, ($) => t_git_is_clean_to_paragraph.Error($))
                            case 'working directory has open changes': return p_.option($, ($) => sh.ph.text("working directory has open changes after updating package dependencies"))
                            default: return p_.exhaustive($[0])
                        }
                    })
            ]))
            case 'error while running npm version': return p_.option($, ($) => sh.ph.composed([
                sh.ph.text("could not increment version: "),
                t_npm_to_paragraph.Error($)
            ]))
            case 'error while running npm update': return p_.option($, ($) => sh.ph.composed([
                sh.ph.text("could not update npm: "),
                t_npm_to_paragraph.Error($)
            ]))
            case 'error while running npm publish': return p_.option($, ($) => sh.ph.composed([
                sh.ph.text("could not publish to npm: "),
                t_npm_to_paragraph.Error($)
            ]))
            case 'error while logging': return p_.option($, ($) => sh.ph.composed([
                sh.ph.text("could not log"),
            ]))
            case 'error while getting package.json': return p_.option($, ($) => sh.ph.composed([
                sh.ph.text("could not read package.json: "),
                t_get_package_json_to_paragraph.Error($)
            ]))
            case 'error while running git extended commit': return p_.option($, ($) => sh.ph.composed([
                sh.ph.text("could not commit and push: "),
                t_git_ec_to_paragraph.Error($)
            ]))

            default: return p_.exhaustive($[0])
        }
    })