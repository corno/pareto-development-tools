import * as _ea from 'exupery-core-alg'
import * as _et from 'exupery-core-types'

import * as d_in from "../../../interface/commands/assert-clean"
import * as d_out from "pareto-fountain-pen/dist/interface/generated/pareto/schemas/block/data_types/target"

import * as sh from "pareto-fountain-pen/dist/shorthands/block"

import * as t_git_is_clean_to_fountain_pen from "../../../../../modules/git/implementation/transformers/is_clean/fountain_pen"

export type Error = _et.Transformer<d_out.Block_Part, d_in.Error>

export const Error: Error = ($) => _ea.cc($, ($) => {
    switch ($[0]) {
        case 'working directory is not clean': return _ea.ss($, ($) => sh.b.sub([
            sh.b.snippet(`working directory not clean`),
        ]))
        case 'unexpected error': return _ea.ss($, ($) => sh.b.sub([
            sh.b.snippet(`unexpected error:`),
            t_git_is_clean_to_fountain_pen.Error($)
        ]))
        default: return _ea.au($[0])
    }
})