import * as _p from 'pareto-core/dist/transformer'
import * as _pi from 'pareto-core/dist/interface'

import * as d_in from "../../../../../interface/to_be_generated/assert_is_clean"
import * as d_out from "pareto-fountain-pen/dist/interface/generated/liana/schemas/block/data"

import * as sh from "pareto-fountain-pen/dist/shorthands/block"

import * as t_git_is_clean_to_fountain_pen from "../../is_repository_clean/transformers/fountain_pen"

export type Error = _pi.Transformer<d_in.Error, d_out.Block_Part>

export const Error: Error = ($) => _p.sg($, ($) => {
    switch ($[0]) {
        case 'working directory is not clean': return _p.ss($, ($) => sh.b.sub([
            sh.b.snippet(`working directory not clean`),
        ]))
        case 'unexpected error': return _p.ss($, ($) => sh.b.sub([
            sh.b.snippet(`unexpected error:`),
            t_git_is_clean_to_fountain_pen.Error($)
        ]))
        default: return _p.au($[0])
    }
})