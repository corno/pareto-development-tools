import * as _p from 'pareto-core-transformer'
import * as _pi from 'pareto-core-interface'

import * as d_in from "../../../../../interface/to_be_generated/api"
import * as d_out from "pareto-fountain-pen/dist/interface/generated/pareto/schemas/block/data"

export namespace signatures {
    export type Error = _pi.Transformer<d_in.Error, d_out.Block_Part>
}

//shorthands
import * as sh from "pareto-fountain-pen/dist/shorthands/block"

//dependencies
import * as t_git_extended_commit_to_fountain_pen from "../../../../../modules/git/implementation/manual/schemas/extended_commit/transformers/fountain_pen"
import * as t_git_assert_clean_to_fountain_pen from "../../../../../modules/git/implementation/manual/schemas/assert_is_clean/transformers/fountain_pen"
import * as t_git_remove_tracked_but_ignored from "../../../../../modules/git/implementation/manual/schemas/remove_tracked_but_ignored/transformers/fountain_pen"

import * as t_build_and_test_to_fountain_pen from "../../build_and_test/transformers/fountain_pen"
import * as t_build_to_fountain_pen from "../../build/transformers/fountain_pen"
import * as t_dependency_graph_to_fountain_pen from "../../dependency_graph/transformers/fountain_pen"
import * as t_line_count_to_fountain_pen from "../../directory_analysis/transformers/fountain_pen"
import * as t_publish from "../../publish/transformers/fountain_pen"
import * as t_update_dependencies from "../../update_package_dependencies/transformers/fountain_pen"
import * as t_read_directory_to_fountain_pen from "pareto-resources/dist/implementation/manual/schemas/read_directory/transformers/fountain_pen"
import * as t_set_up_comparison_against_published from "../../../../../modules/npm/implementation/manual/schemas/set_up_comparison_against_published/transformers/fountain_pen"

export const Error: signatures.Error = ($) => _p.sg($, ($) => {
    switch ($[0]) {
        case 'analyze file structure': return _p.ss($, ($) => t_line_count_to_fountain_pen.Error($))
        case 'build and test': return _p.ss($, ($) => t_build_and_test_to_fountain_pen.Error($))
        case 'dependency graph': return _p.ss($, ($) => t_dependency_graph_to_fountain_pen.Error($))
        case 'git assert clean': return _p.ss($, ($): d_out.Block_Part => t_git_assert_clean_to_fountain_pen.Error($))
        case 'project': return _p.ss($, ($) => _p.sg($, ($) => {
            switch ($[0]) {
                case 'packages': return _p.ss($, ($) => sh.b.indent(_p.list.from_dictionary($, ($, key) => sh.g.nested_block([
                    sh.b.snippet(`package '${key}': `),
                    _p.sg($, ($) => {
                        switch ($[0]) {
                            case 'build and test': return _p.ss($, ($) => t_build_and_test_to_fountain_pen.Error($))
                            case 'build': return _p.ss($, ($) => t_build_to_fountain_pen.Error($))
                            case 'git assert clean': return _p.ss($, ($) => t_git_assert_clean_to_fountain_pen.Error($))
                            case 'git commit': return _p.ss($, ($) => t_git_extended_commit_to_fountain_pen.Error($))
                            case 'git remove tracked but ignored': return _p.ss($, ($) => t_git_remove_tracked_but_ignored.Error($))
                            case 'set up comparison': return _p.ss($, ($) => t_set_up_comparison_against_published.Error($))
                            case 'update dependencies': return _p.ss($, ($) => t_update_dependencies.Error($))
                            default: return _p.au($[0])
                        }
                    })
                ]))))
                case 'could not read packages directory': return _p.ss($, ($) => sh.b.sub([
                    sh.b.snippet(`could not read packages directory: `),
                    t_read_directory_to_fountain_pen.Error($)
                ]))
                default: return _p.au($[0])
            }
        }))
        case 'publish': return _p.ss($, ($): d_out.Block_Part => t_publish.Error($))
        case 'set up comparison': return _p.ss($, ($): d_out.Block_Part => t_set_up_comparison_against_published.Error($))
        default: return _p.au($[0])
    }
})