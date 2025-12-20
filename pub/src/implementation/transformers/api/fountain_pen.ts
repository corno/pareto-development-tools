import * as _ea from 'exupery-core-alg'
import * as _et from 'exupery-core-types'

import * as d_in from "../../../interface/algorithms/commands/api"
import * as d_out from "pareto-fountain-pen/dist/interface/generated/pareto/schemas/block/data_types/target"

export type Error = _et.Transformer<d_out.Block_Part, d_in.Error>

import * as sh from "pareto-fountain-pen/dist/shorthands/block"

// import * as t_assert_clean_to_fountain_pen from "./commands/assert_clean/text"

import * as t_git_extended_commit_to_fountain_pen from "../../../modules/git/implementation/transformers/extended_commit/fountain_pen"
import * as t_git_assert_clean_to_fountain_pen from "../../../modules/git/implementation/transformers/assert_clean/fountain_pen"
import * as t_git_remove_tracked_but_ignored from "../../../modules/git/implementation/transformers/remove_tracked_but_ignored/fountain_pen"

import * as t_build_and_test_to_fountain_pen from "../build_and_test/fountain_pen"
import * as t_build_to_fountain_pen from "../build/fountain_pen"
import * as t_dependency_graph_to_fountain_pen from "../dependency_graph/fountain_pen"
import * as t_line_count_to_fountain_pen from "../directory_analysis/fountain_pen"
import * as t_update_dependencies from "../update_dependencies/fountain_pen"
import * as t_read_directory_to_fountain_pen from "exupery-resources/dist/implementation/transformers/read_directory/fountain_pen"
import * as t_set_up_comparison_against_published from "../../../modules/npm/implementation/transformers/set_up_comparison_against_published/fountain_pen"

export const Error: Error = ($) => _ea.cc($, ($) => {
    switch ($[0]) {
        case 'project': return _ea.ss($, ($) => _ea.cc($, ($) => {
            switch ($[0]) {
                case 'packages': return _ea.ss($, ($) => sh.b.indent($.deprecated_to_array(() => 0).map(($) => sh.g.nested_block([
                    sh.b.snippet(`package '${$.key}': `),
                    _ea.cc($.value, ($) => {
                        switch ($[0]) {
                            case 'build and test': return _ea.ss($, ($) => t_build_and_test_to_fountain_pen.Error($))
                            case 'build': return _ea.ss($, ($) => t_build_to_fountain_pen.Error($))
                            case 'git assert clean': return _ea.ss($, ($) => t_git_assert_clean_to_fountain_pen.Error($))
                            case 'git commit': return _ea.ss($, ($) => t_git_extended_commit_to_fountain_pen.Error($))
                            case 'git remove tracked but ignored': return _ea.ss($, ($) => t_git_remove_tracked_but_ignored.Error($))
                            case 'set up comparison': return _ea.ss($, ($) => t_set_up_comparison_against_published.Error($))
                            case 'update dependencies': return _ea.ss($, ($) => t_update_dependencies.Error($))
                            default: return _ea.au($[0])
                        }
                    })
                ]))))
                case 'could not read packages directory': return _ea.ss($, ($) => sh.b.sub([
                    sh.b.snippet(`could not read packages directory: `),
                    t_read_directory_to_fountain_pen.Error($)
                ]))
                default: return _ea.au($[0])
            }
        }))
        case 'dependency graph': return _ea.ss($, ($) => t_dependency_graph_to_fountain_pen.Error($))
        case 'line count': return _ea.ss($, ($) => t_line_count_to_fountain_pen.Error($))
        case 'set up comparison': return _ea.ss($, ($): d_out.Block_Part => t_set_up_comparison_against_published.Error($))
        case 'git assert clean': return _ea.ss($, ($): d_out.Block_Part => t_git_assert_clean_to_fountain_pen.Error($))
        default: return _ea.au($[0])
    }
})