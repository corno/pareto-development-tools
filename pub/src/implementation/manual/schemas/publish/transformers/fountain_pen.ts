import * as _p from 'pareto-core-transformer'
import * as _pi from 'pareto-core-interface'

import * as d_in from "../../../../../interface/to_be_generated/publish"
import * as d_out from "pareto-fountain-pen/dist/interface/generated/pareto/schemas/block/data"

import * as sh from "pareto-fountain-pen/dist/shorthands/block"

export type Error = _pi.Transformer<d_in.Error, d_out.Block_Part>

import * as t_git_push_to_fountain_pen from "../../../../../modules/git/implementation/manual/schemas/push/transformers/fountain_pen"
import * as t_git_assert_is_clean_to_fountain_pen from "../../../../../modules/git/implementation/manual/schemas/assert_is_clean/transformers/fountain_pen"
import * as t_git_make_pristine_to_fountain_pen from "../../../../../modules/git/implementation/manual/schemas/make_pristine/transformers/fountain_pen"
import * as t_clean_and_update_package_dependencies_to_fountain_pen from "../../update_package_dependencies/transformers/fountain_pen"
import * as t_git_is_clean_to_fountain_pen from "../../../../../modules/git/implementation/manual/schemas/is_repository_clean/transformers/fountain_pen"
import * as t_npm_to_fountain_pen from "../../../../../modules/npm/implementation/manual/schemas/npm/transformers/fountain_pen"
import * as t_build_and_test_to_fountain_pen from "../../build_and_test/transformers/fountain_pen"

export const Error: Error = ($) => _p.sg($, ($) => {
    switch ($[0]) {
        case 'error while running git push': return _p.ss($, ($) => sh.b.sub([
            t_git_push_to_fountain_pen.Error($)
        ]))
        case 'error while running git assert is clean at the start': return _p.ss($, ($) => sh.b.sub([
            _p.sg($, ($) => {
                switch ($[0]) {
                    case 'unexpected error': return _p.ss($, ($) => t_git_is_clean_to_fountain_pen.Error($))
                    case 'working directory is not clean': return _p.ss($, ($) => sh.b.snippet(`working directory is not clean at the start`))
                    default: return _p.au($[0])
                }
            })
        ]))
        case 'error while running git make pristine': return _p.ss($, ($) => sh.b.sub([
            t_git_make_pristine_to_fountain_pen.Error($)
        ]))
        case 'error while running update package dependencies': return _p.ss($, ($) => sh.b.sub([
            t_clean_and_update_package_dependencies_to_fountain_pen.Error($)
        ]))
        case 'error while running build and test': return _p.ss($, ($) => t_build_and_test_to_fountain_pen.Error($, { 'concise': false }))
        case 'error while running git assert is clean after updating package dependencies': return _p.ss($, ($) => sh.b.sub([
            _p.sg($, ($) => {
                switch ($[0]) {
                    case 'unexpected error': return _p.ss($, ($) => t_git_is_clean_to_fountain_pen.Error($))
                    case 'working directory is not clean': return _p.ss($, ($) => sh.b.snippet(`working directory is not clean after updating package dependencies`))
                    default: return _p.au($[0])
                }
            })
        ]))
        case 'error while running npm version': return _p.ss($, ($) => sh.b.sub([
            sh.b.snippet(`could not increment version: `),
            t_npm_to_fountain_pen.Error($)
        ]))
        case 'error while running npm publish': return _p.ss($, ($) => sh.b.sub([
            sh.b.snippet(`could not publish to npm: `),
            t_npm_to_fountain_pen.Error($)
        ]))

        default: return _p.au($[0])
    }
})