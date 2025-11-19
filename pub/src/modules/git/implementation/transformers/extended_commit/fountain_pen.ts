import * as _ea from 'exupery-core-alg'
import * as _et from 'exupery-core-types'

import * as d_in from "../../../interface/commands/extended_commit"
import * as d_out from "pareto-fountain-pen/dist/interface/generated/pareto/schemas/block/data_types/target"

import * as sh from "pareto-fountain-pen/dist/shorthands/block"

export type Error = _et.Transformer_Without_Parameters<d_out.Block_Part, d_in.Error>

import * as t_eqe_to_fountain_pen from "exupery-resources/dist/implementation/transformers/execute_query_executable/fountain_pen"
import * as t_git_is_clean_to_fountain_pen from "../../../../git/implementation/transformers/is_clean/fountain_pen"

export const Error: Error = ($) => _ea.cc($, ($): d_out.Block_Part => {
    switch ($[0]) {
        case 'asserting git not clean': return _ea.ss($, ($) => sh.b.sub([
            sh.b.snippet(`error while asserting git is not clean: `),
            t_git_is_clean_to_fountain_pen.Error($)
        ]))
        case 'could not stage': return _ea.ss($, ($) => sh.b.sub([
            sh.b.snippet(`could not stage: `),
            t_eqe_to_fountain_pen.Error($)
        ]))
        case 'could not commit': return _ea.ss($, ($) => sh.b.sub([
            sh.b.snippet(`could not commit: `),
            t_eqe_to_fountain_pen.Error($)
        ]))
        case 'could not push': return _ea.ss($, ($) => sh.b.sub([
            sh.b.snippet(`could not push: `),
            t_eqe_to_fountain_pen.Error($)
        ]))
        default: return _ea.au($[0])
    }
})