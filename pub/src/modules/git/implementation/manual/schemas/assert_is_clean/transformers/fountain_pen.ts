import * as _pt from 'pareto-core-transformer'
import * as _pi from 'pareto-core-interface'

import * as d_in from "../../../../../interface/to_be_generated/assert_is_clean"
import * as d_out from "pareto-fountain-pen/dist/interface/generated/pareto/schemas/block/data_types/target"

import * as sh from "pareto-fountain-pen/dist/shorthands/block"

import * as t_git_is_clean_to_fountain_pen from "../../is_repository_clean/transformers/fountain_pen"

export type Error = _pi.Transformer<d_in.Error, d_out.Block_Part>

export const Error: Error = ($) => _pt.cc($, ($) => {
    switch ($[0]) {
        case 'working directory is not clean': return _pt.ss($, ($) => sh.b.sub([
            sh.b.snippet(`working directory not clean`),
        ]))
        case 'unexpected error': return _pt.ss($, ($) => sh.b.sub([
            sh.b.snippet(`unexpected error:`),
            t_git_is_clean_to_fountain_pen.Error($)
        ]))
        default: return _pt.au($[0])
    }
})