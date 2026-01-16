import * as _p from 'pareto-core-transformer'
import * as _pi from 'pareto-core-interface'

import * as d_in from "../../../../../interface/to_be_generated/extended_commit"
import * as d_out from "pareto-fountain-pen/dist/interface/generated/pareto/schemas/block/data"

import * as sh from "pareto-fountain-pen/dist/shorthands/block"

export type Error = _pi.Transformer<d_in.Error, d_out.Block_Part>

import * as t_ece_to_fountain_pen from "pareto-resources/dist/implementation/manual/schemas/execute_command_executable/transformers/fountain_pen"
import * as t_git_is_clean_to_fountain_pen from "../../is_repository_clean/transformers/fountain_pen"

export const Error: Error = ($) => _p.sg($, ($): d_out.Block_Part => {
    switch ($[0]) {
        case 'asserting git not clean': return _p.ss($, ($) => sh.b.sub([
            sh.b.snippet(`error while asserting git is not clean: `),
            t_git_is_clean_to_fountain_pen.Error($)
        ]))
        case 'could not stage': return _p.ss($, ($) => sh.b.sub([
            sh.b.snippet(`could not stage: `),
            t_ece_to_fountain_pen.Error($)
        ]))
        case 'could not commit': return _p.ss($, ($) => sh.b.sub([
            sh.b.snippet(`could not commit: `),
            t_ece_to_fountain_pen.Error($)
        ]))
        case 'could not push': return _p.ss($, ($) => sh.b.sub([
            sh.b.snippet(`could not push: `),
            t_ece_to_fountain_pen.Error($)
        ]))
        default: return _p.au($[0])
    }
})