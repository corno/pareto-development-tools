import * as _p from 'pareto-core/dist/expression'
import * as _pi from 'pareto-core/dist/interface'

import * as d_in from "../../../../../interface/to_be_generated/is_inside_work_tree"
import * as d_out from "pareto-fountain-pen/dist/interface/generated/liana/schemas/block/data"

export type Error = _pi.Transformer<d_in.Error, d_out.Block_Part>

import * as sh from "pareto-fountain-pen/dist/shorthands/block"

export const Error: Error = ($) => _p.decide.state($, ($) => {
    switch ($[0]) {
        case 'could not run git command': return _p.ss($, ($) => sh.b.sub([
            sh.b.literal("could not run git command: "),
            sh.b.list($.message.lines.__l_map(($) => sh.b.literal($)))
        ]))
        case 'unexpected output': return _p.ss($, ($) => sh.b.sub([
            sh.b.literal("unexpected output from git command: "),
            sh.b.list($.lines.__l_map(($) => sh.b.literal($)))
        ]))
        default: return _p.au($[0])
    }
})