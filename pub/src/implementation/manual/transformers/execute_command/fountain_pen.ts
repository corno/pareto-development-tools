import * as _p from 'pareto-core/dist/assign'
import * as _pi from 'pareto-core/dist/interface'

import * as d_in from "../../../../interface/to_be_generated/execute_command"
import * as d_out from "pareto-fountain-pen/dist/interface/generated/liana/schemas/prose/data"

export namespace signatures {
    export type Error = _pi.Transformer<d_in.Error, d_out.Phrase>
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

export const Error: signatures.Error = ($) => _p.decide.state($, ($) => {
    switch ($[0]) {
        case 'package': return _p.ss($, ($) => _p.decide.state($, ($) => {
            switch ($[0]) {
                case 'build and test': return _p.ss($, ($) => t_build_and_test_to_fountain_pen.Error($.error, { 'concise': $.concise }))
                case 'publish': return _p.ss($, ($): d_out.Phrase => t_publish.Error($))
                case 'update dependencies': return _p.ss($, ($) => t_update_dependencies.Error($))
                case 'git assert clean': return _p.ss($, ($): d_out.Phrase => t_git_assert_clean_to_fountain_pen.Error($))
                case 'git commit': return _p.ss($, ($) => t_git_commit_to_fountain_pen.Error($))

                default: return _p.au($[0])
            }
        }))
        case 'get project files': return _p.ss($, ($) => t_line_count_to_fountain_pen.Error($))
        case 'dependency graph': return _p.ss($, ($) => t_dependency_graph_to_fountain_pen.Error($))
        case 'all': return _p.ss($, ($) => _p.decide.state($, ($) => {
            switch ($[0]) {
                case 'packages': return _p.ss($, ($) => sh.ph.composed([
                    sh.ph.literal("could not execute command for the following packages:"),
                    sh.ph.indent(
                        sh.pg.sentences(
                            _p.list.from.dictionary(
                                $,
                            ).convert(
                                ($, id) => sh.sentence([
                                    sh.ph.literal("package '"),
                                    sh.ph.literal(id),
                                    sh.ph.literal("': "),
                                    _p.decide.state($, ($) => {
                                        switch ($[0]) {
                                            case 'build and test': return _p.ss($, ($) => t_build_and_test_to_fountain_pen.Error(
                                                $.error,
                                                { 'concise': $.concise }
                                            ))
                                            case 'build': return _p.ss($, ($) => t_build_to_fountain_pen.Error(
                                                $,
                                                { 'concise': false }
                                            ))
                                            case 'git assert clean': return _p.ss($, ($) => t_git_assert_clean_to_fountain_pen.Error($))
                                            case 'git commit': return _p.ss($, ($) => t_git_commit_to_fountain_pen.Error($))
                                            case 'git remove tracked but ignored': return _p.ss($, ($) => t_git_remove_tracked_but_ignored.Error($))
                                            case 'set up comparison': return _p.ss($, ($) => t_set_up_comparison_against_published.Error($))
                                            case 'update dependencies': return _p.ss($, ($) => t_update_dependencies.Error($))
                                            default: return _p.au($[0])
                                        }
                                    })
                                ])
                            )
                        )
                    )
                ]))
                case 'could not read packages directory': return _p.ss($, ($) => sh.ph.composed([
                    sh.ph.literal("could not read packages directory: "),
                    t_read_directory_to_fountain_pen.Error($)
                ]))
                default: return _p.au($[0])
            }
        }))
        case 'set up comparison': return _p.ss($, ($): d_out.Phrase => t_set_up_comparison_against_published.Error($))
        default: return _p.au($[0])
    }
})