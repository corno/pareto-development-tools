import * as p_ from 'pareto-core/implementation/transformer'

import type * as interface_ from "../../../../declarations/transformers/execute_command/prose.js"

//shorthands
import * as sh from "pareto-fountain-pen/shorthands/prose/deprecated"

//dependencies
import * as t_git_commit_to_prose from "../git_commit/prose.js"
import * as t_git_assert_no_open_changes_to_prose from "../../../../modules/version_control_api/implementation/manual/transformers/assert_no_open_changes/prose.js"

import * as t_build_and_test_to_prose from "../build_and_test/prose.js"
import * as t_build_to_prose from "../build/prose.js"
import * as t_dependency_graph_to_prose from "../create_dependency_graph/prose.js"
import * as t_line_count_to_prose from "../get_project_files/prose.js"
import * as t_publish from "../publish/prose.js"
import * as t_update_dependencies from "../update_package_dependencies/prose.js"
import * as t_read_directory_to_prose from "pareto-filesystem-unrestricted-api/implementation/manual/transformers/read_directory/prose"
import * as t_set_up_comparison_against_published from "../../../../modules/npm/implementation/manual/transformers/set_up_comparison_against_published/prose.js"

export const Error: interface_.Error = ($) => p_.from.state($).decide(
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
                            sh.ph.literal("could not execute command for the following packages:"),
                            sh.ph.indent(
                                sh.pg.sentences(
                                    p_.from.dictionary($).convert_to_list(
                                        ($, id) => sh.sentence([
                                            sh.ph.literal("package '"),
                                            sh.ph.literal(id),
                                            sh.ph.literal("': "),
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
                            sh.ph.literal("could not read packages directory: "),
                            t_read_directory_to_prose.Error($)
                        ]))
                        default: return p_.exhaustive($[0])
                    }
                }))
            case 'set up comparison': return p_.option($, ($) => t_set_up_comparison_against_published.Error($))
            default: return p_.exhaustive($[0])
        }
    })