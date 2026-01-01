import * as _pt from 'pareto-core-transformer'
import * as _pi from 'pareto-core-interface'

import * as d_in from "../../../../../interface/to_be_generated/extended_commit"
import * as d_out from "pareto-fountain-pen/dist/interface/generated/pareto/schemas/block/data_types/target"

import * as sh from "pareto-fountain-pen/dist/shorthands/block"

export type Error = _pi.Transformer<d_in.Error, d_out.Block_Part>

import * as t_eqe_to_fountain_pen from "pareto-resources/dist/implementation/manual/schemas/execute_query_executable/transformers/fountain_pen"
import * as t_git_is_clean_to_fountain_pen from "../../is_repository_clean/transformers/fountain_pen"

export const Error: Error = ($) => _pt.cc($, ($): d_out.Block_Part => {
    switch ($[0]) {
        case 'asserting git not clean': return _pt.ss($, ($) => sh.b.sub([
            sh.b.snippet(`error while asserting git is not clean: `),
            t_git_is_clean_to_fountain_pen.Error($)
        ]))
        case 'could not stage': return _pt.ss($, ($) => sh.b.sub([
            sh.b.snippet(`could not stage: `),
            t_eqe_to_fountain_pen.Error($)
        ]))
        case 'could not commit': return _pt.ss($, ($) => sh.b.sub([
            sh.b.snippet(`could not commit: `),
            t_eqe_to_fountain_pen.Error($)
        ]))
        case 'could not push': return _pt.ss($, ($) => sh.b.sub([
            sh.b.snippet(`could not push: `),
            t_eqe_to_fountain_pen.Error($)
        ]))
        default: return _pt.au($[0])
    }
})