import * as p_ from 'pareto-core/dist/implementation/transformer'
import * as p_i from 'pareto-core/dist/interface/transformer'

import * as d_in from "../../../../interface/data/execute_command"
import * as d_out from "pareto-fountain-pen/dist/interface/generated/liana/schemas/prose/data"

export namespace signatures {
    export type Error = p_i.Transformer<d_in.Error, d_out.Phrase>
}

//shorthands
import * as sh from "pareto-fountain-pen/dist/shorthands/prose"

//dependencies
import * as t_git_commit_to_fountain_pen from "../git_commit/fountain_pen"
import * as t_git_assert_clean_to_fountain_pen from "../../../../modules/git/implementation/manual/transformers/assert_is_clean/fountain_pen"
import * as t_git_remove_tracked_but_ignored from "../../../../modules/git/implementation/manual/transformers/remove_tracked_but_ignored/fountain_pen"

import * as t_build_and_test_to_fountain_pen from "../build_and_test/fountain_pen"
import * as t_build_to_fountain_pen from "../build/fountain_pen"
import * as t_dependency_graph_to_fountain_pen from "../create_dependency_graph/fountain_pen"
import * as t_line_count_to_fountain_pen from "../get_project_files/fountain_pen"
import * as t_publish from "../publish/fountain_pen"
import * as t_update_dependencies from "../update_package_dependencies/fountain_pen"
import * as t_read_directory_to_fountain_pen from "pareto-resources/dist/implementation/manual/transformers/read_directory/fountain_pen"
import * as t_set_up_comparison_against_published from "../../../../modules/npm/implementation/manual/transformers/set_up_comparison_against_published/fountain_pen"

export const Error: signatures.Error = ($) => p_.decide.state($, ($) => {
    switch ($[0]) {
        case 'package': return p_.ss($, ($) => p_.decide.state($, ($) => {
            switch ($[0]) {
                case 'build and test': return p_.ss($, ($) => t_build_and_test_to_fountain_pen.Error($.error, { 'concise': $.concise }))
                case 'publish': return p_.ss($, ($): d_out.Phrase => t_publish.Error($))
                case 'update dependencies': return p_.ss($, ($) => t_update_dependencies.Error($))
                case 'git assert clean': return p_.ss($, ($): d_out.Phrase => t_git_assert_clean_to_fountain_pen.Error($))
                case 'git commit': return p_.ss($, ($) => t_git_commit_to_fountain_pen.Error($))

                default: return p_.au($[0])
            }
        }))
        case 'get project files': return p_.ss($, ($) => t_line_count_to_fountain_pen.Error($))
        case 'dependency graph': return p_.ss($, ($) => t_dependency_graph_to_fountain_pen.Error($))
        case 'all': return p_.ss($, ($) => p_.decide.state($, ($) => {
            switch ($[0]) {
                case 'packages': return p_.ss($, ($) => sh.ph.composed([
                    sh.ph.literal("could not execute command for the following packages:"),
                    sh.ph.indent(
                        sh.pg.sentences(
                            p_.list.from.dictionary(
                                $,
                            ).convert(
                                ($, id) => sh.sentence([
                                    sh.ph.literal("package '"),
                                    sh.ph.literal(id),
                                    sh.ph.literal("': "),
                                    p_.decide.state($, ($) => {
                                        switch ($[0]) {
                                            case 'build and test': return p_.ss($, ($) => t_build_and_test_to_fountain_pen.Error(
                                                $.error,
                                                { 'concise': $.concise }
                                            ))
                                            case 'build': return p_.ss($, ($) => t_build_to_fountain_pen.Error(
                                                $,
                                                { 'concise': false }
                                            ))
                                            case 'git assert clean': return p_.ss($, ($) => t_git_assert_clean_to_fountain_pen.Error($))
                                            case 'git commit': return p_.ss($, ($) => t_git_commit_to_fountain_pen.Error($))
                                            case 'git remove tracked but ignored': return p_.ss($, ($) => t_git_remove_tracked_but_ignored.Error($))
                                            case 'set up comparison': return p_.ss($, ($) => t_set_up_comparison_against_published.Error($))
                                            case 'update dependencies': return p_.ss($, ($) => t_update_dependencies.Error($))
                                            default: return p_.au($[0])
                                        }
                                    })
                                ])
                            )
                        )
                    )
                ]))
                case 'could not read packages directory': return p_.ss($, ($) => sh.ph.composed([
                    sh.ph.literal("could not read packages directory: "),
                    t_read_directory_to_fountain_pen.Error($)
                ]))
                default: return p_.au($[0])
            }
        }))
        case 'set up comparison': return p_.ss($, ($): d_out.Phrase => t_set_up_comparison_against_published.Error($))
        default: return p_.au($[0])
    }
})