import * as p_ from 'pareto-core/implementation/transformer'

//schemas
import type * as s_in from "../../../interface/schemas/execute_command.js"
import type * as s_out from "../../../interface/schemas/paragraph.js"

namespace declarations {
    export type Error = p_.Transformer<
        s_in.Error,
        s_out.Phrase
    >
}

//shorthands
import * as sh from "pareto-fountain-pen/shorthands/paragraph/deprecated"

//dependencies
import * as t_git_commit_to_prose from "../git_commit/paragraph.js"
import * as t_git_assert_no_open_changes_to_prose from "../../../submodules/version_control_api/implementation/transformers/assert_no_open_changes/paragraph.js"

import * as t_build_and_test_to_prose from "../build_and_test/paragraph.js"
import * as t_build_to_prose from "../build/paragraph.js"
import * as t_dependency_graph_to_prose from "../create_dependency_graph/paragraph.js"
import * as t_line_count_to_prose from "../get_project_files/paragraph.js"
import * as t_publish from "../publish/paragraph.js"
import * as t_update_dependencies from "../update_package_dependencies/paragraph.js"
import * as ser_read_directory from "pareto-filesystem-unrestricted-api/implementation/serializers/read_directory"
import * as t_set_up_comparison_against_published from "../../../submodules/npm/implementation/transformers/set_up_comparison_against_published/paragraph.js"

export const Error: declarations.Error = ($) => p_.from.state($).decide(
    ($) => {
        switch ($[0]) {
            case 'package': return p_.option($, ($) => p_.from.state($).decide(
                ($) => {
                    switch ($[0]) {
                        case 'build and test': return p_.option($, ($) => t_build_and_test_to_prose.Error($.error, { 'concise': $.concise }))
                        case 'publish': return p_.option($, ($) => t_publish.Error($))
                        case 'update dependencies': return p_.option($, ($) => t_update_dependencies.Error($))
                        case 'version control assert no open changes': return p_.option($, ($) => t_git_assert_no_open_changes_to_prose.Error($))
                        case 'commit changes': return p_.option($, ($) => t_git_commit_to_prose.Error($))

                        default: return p_.exhaustive($[0])
                    }
                }))
            case 'get project files': return p_.option($, ($) => t_line_count_to_prose.Error($))
            case 'dependency graph': return p_.option($, ($) => t_dependency_graph_to_prose.Error($))
            case 'all': return p_.option($, ($) => p_.from.state($).decide(
                ($) => {
                    switch ($[0]) {
                        case 'packages': return p_.option($, ($) => sh.ph.composed([
                            sh.ph.text("could not execute command for the following packages:"),
                            sh.ph.indent(
                                sh.pg.sentences(
                                    p_.from.dictionary($).convert_to_list(
                                        ($, id) => sh.sentence([
                                            sh.ph.text("package '"),
                                            sh.ph.text(id),
                                            sh.ph.text("': "),
                                            p_.from.state($).decide(
                                                ($) => {
                                                    switch ($[0]) {
                                                        case 'build and test': return p_.option($, ($) => t_build_and_test_to_prose.Error(
                                                            $.error,
                                                            { 'concise': $.concise }
                                                        ))
                                                        case 'build': return p_.option($, ($) => t_build_to_prose.Error(
                                                            $,
                                                            { 'concise': false }
                                                        ))
                                                        case 'version control assert no open changes': return p_.option($, ($) => t_git_assert_no_open_changes_to_prose.Error($))
                                                        case 'commit changes': return p_.option($, ($) => t_git_commit_to_prose.Error($))
                                                        case 'set up comparison': return p_.option($, ($) => t_set_up_comparison_against_published.Error($))
                                                        case 'update dependencies': return p_.option($, ($) => t_update_dependencies.Error($))
                                                        default: return p_.exhaustive($[0])
                                                    }
                                                })
                                        ])
                                    )
                                )
                            )
                        ]))
                        case 'could not read packages directory': return p_.option($, ($) => sh.ph.composed([
                            sh.ph.text("could not read packages directory: "),
                            sh.ph.text(ser_read_directory.Error($))
                        ]))
                        default: return p_.exhaustive($[0])
                    }
                }))
            case 'set up comparison': return p_.option($, ($) => t_set_up_comparison_against_published.Error($))
            default: return p_.exhaustive($[0])
        }
    })