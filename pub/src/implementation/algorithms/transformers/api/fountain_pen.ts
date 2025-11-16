import * as _ea from 'exupery-core-alg'
import * as _et from 'exupery-core-types'

import * as d_in from "../../../../interface/temp/procedures/api"
import * as d_out from "pareto-fountain-pen/dist/interface/generated/pareto/schemas/block/data_types/target"

export type Error = _et.Transformer_Without_Parameters<d_in.Error, d_out.Block_Part>

import * as sh from "pareto-fountain-pen/dist/shorthands/block"

// import * as t_assert_clean_to_fountain_pen from "./commands/assert_clean/text"

import * as t_git_extended_commit_to_fountain_pen from "../commands/git_extended_commit/fountain_pen"
import * as t_git_assert_clean_to_fountain_pen from "../commands/git_assert_clean/fountain_pen"
import * as t_build_and_test_to_fountain_pen from "../commands/build_and_test/fountain_pen"
import * as t_build_to_fountain_pen from "../commands/build/fountain_pen"
import * as t_git_remove_tracked_but_ignored from "../commands/git_remove_tracked_but_ignored/fountain_pen"
import * as t_update_dependencies from "../commands/update_dependencies/fountain_pen"
import * as t_read_directory_to_fountain_pen from "../temp_exupery_resources/read_directory/fountain_pen"

export const Error: Error = ($) => _ea.cc($, ($) => {
    switch ($[0]) {
        case 'project': return _ea.ss($, ($) => _ea.cc($, ($) => {
            switch ($[0]) {
                case 'packages': return _ea.ss($, ($) => sh.b.sub($.deprecated_to_array(() => 0).map(($) => sh.b.sub([
                    sh.b.snippet(`package '${$.key}': `),
                    _ea.cc($.value, ($) => {
                        switch ($[0]) {
                            case 'build and test': return _ea.ss($, ($) => t_build_and_test_to_fountain_pen.Error($))
                            case 'build': return _ea.ss($, ($) => t_build_to_fountain_pen.Error($))
                            case 'git assert clean': return _ea.ss($, ($) => t_git_assert_clean_to_fountain_pen.Error($))
                            case 'git commit': return _ea.ss($, ($) => t_git_extended_commit_to_fountain_pen.Error($))
                            case 'git remove tracked but ignored': return _ea.ss($, ($) => t_git_remove_tracked_but_ignored.Error($))
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
        case 'git assert clean': return _ea.ss($, ($): d_out.Block_Part => t_git_assert_clean_to_fountain_pen.Error($))
        default: return _ea.au($[0])
    }
})