import * as _p from 'pareto-core/dist/transformer'
import * as _pi from 'pareto-core/dist/interface'

import * as d_in from "../../../../../interface/to_be_generated/git_commit"
import * as d_out from "pareto-fountain-pen/dist/interface/generated/liana/schemas/block/data"

export type Error = _pi.Transformer<d_in.Error, d_out.Block_Part>

import * as sh from "pareto-fountain-pen/dist/shorthands/block"

import * as t_git_extended_commit_to_fountain_pen from "../../../../../modules/git/implementation/manual/schemas/extended_commit/transformers/fountain_pen"
import * as t_build_and_test_to_fountain_pen from "../../build_and_test/transformers/fountain_pen"

export const Error: Error = ($) => _p.decide.state($, ($) => {
    switch ($[0]) {
        case 'git extended commit': return _p.ss($, ($) => sh.b.sub([
            t_git_extended_commit_to_fountain_pen.Error($)
        ]))
        case 'error while running build and test': return _p.ss($, ($) => sh.b.sub([
            t_build_and_test_to_fountain_pen.Error($, { 'concise': true })
        ]))
        default: return _p.au($[0])
    }
})