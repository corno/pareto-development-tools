import * as _pt from 'pareto-core-transformer'
import * as _pi from 'pareto-core-interface'

import * as d_in from "../../../../interface/to_be_generated/api"
import * as d_out from "pareto-fountain-pen/dist/interface/generated/pareto/schemas/block/data_types/target"

export type Signature = _pi.Transformer<d_in.Error, d_out.Block_Part>

import * as sh from "pareto-fountain-pen/dist/shorthands/block"

// import * as t_assert_clean_to_fountain_pen from "./commands/assert_clean/text"

import * as t_git_extended_commit_to_fountain_pen from "../../../../modules/git/implementation/transformers/schemas/extended_commit/fountain_pen"
import * as t_git_assert_clean_to_fountain_pen from "../../../../modules/git/implementation/transformers/schemas/assert_is_clean/fountain_pen"
import * as t_git_remove_tracked_but_ignored from "../../../../modules/git/implementation/transformers/schemas/remove_tracked_but_ignored/fountain_pen"

import * as t_build_and_test_to_fountain_pen from "../build_and_test/fountain_pen"
import * as t_build_to_fountain_pen from "../build/fountain_pen"
import * as t_dependency_graph_to_fountain_pen from "../dependency_graph/fountain_pen"
import * as t_line_count_to_fountain_pen from "../directory_analysis/fountain_pen"
import * as t_update_dependencies from "../update_dependencies/fountain_pen"
import * as t_read_directory_to_fountain_pen from "exupery-resources/dist/implementation/transformers/schemas/read_directory/fountain_pen"
import * as t_set_up_comparison_against_published from "../../../../modules/npm/implementation/transformers/schemas/set_up_comparison_against_published/fountain_pen"

export const Error: Signature = ($) => _pt.cc($, ($) => {
    switch ($[0]) {
        case 'analyze file structure': return _pt.ss($, ($) => t_line_count_to_fountain_pen.Error($))
        case 'dependency graph': return _pt.ss($, ($) => t_dependency_graph_to_fountain_pen.Error($))
        case 'git assert clean': return _pt.ss($, ($): d_out.Block_Part => t_git_assert_clean_to_fountain_pen.Error($))
        case 'project': return _pt.ss($, ($) => _pt.cc($, ($) => {
            switch ($[0]) {
                case 'packages': return _pt.ss($, ($) => sh.b.indent($.to_list(($, key) => sh.g.nested_block([
                    sh.b.snippet(`package '${key}': `),
                    _pt.cc($, ($) => {
                        switch ($[0]) {
                            case 'build and test': return _pt.ss($, ($) => t_build_and_test_to_fountain_pen.Error($))
                            case 'build': return _pt.ss($, ($) => t_build_to_fountain_pen.Error($))
                            case 'git assert clean': return _pt.ss($, ($) => t_git_assert_clean_to_fountain_pen.Error($))
                            case 'git commit': return _pt.ss($, ($) => t_git_extended_commit_to_fountain_pen.Error($))
                            case 'git remove tracked but ignored': return _pt.ss($, ($) => t_git_remove_tracked_but_ignored.Error($))
                            case 'set up comparison': return _pt.ss($, ($) => t_set_up_comparison_against_published.Error($))
                            case 'update dependencies': return _pt.ss($, ($) => t_update_dependencies.Error($))
                            default: return _pt.au($[0])
                        }
                    })
                ]))))
                case 'could not read packages directory': return _pt.ss($, ($) => sh.b.sub([
                    sh.b.snippet(`could not read packages directory: `),
                    t_read_directory_to_fountain_pen.Error($)
                ]))
                default: return _pt.au($[0])
            }
        }))
        case 'set up comparison': return _pt.ss($, ($): d_out.Block_Part => t_set_up_comparison_against_published.Error($))
        default: return _pt.au($[0])
    }
})