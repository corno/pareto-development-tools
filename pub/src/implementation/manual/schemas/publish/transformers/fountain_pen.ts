import * as _p from 'pareto-core-transformer'
import * as _pi from 'pareto-core-interface'

import * as d_in from "../../../../../interface/to_be_generated/publish"
import * as d_out from "pareto-fountain-pen/dist/interface/generated/pareto/schemas/block/data_types/target"

import * as sh from "pareto-fountain-pen/dist/shorthands/block"

export type Error = _pi.Transformer<d_in.Error, d_out.Block_Part>

import * as t_git_push_to_fountain_pen from "../../../../../modules/git/implementation/manual/schemas/push/transformers/fountain_pen"

export const Error: Error = ($) => _p.sg($, ($) => {
    switch ($[0]) {
        case 'error while running git push': return _p.ss($, ($) => sh.b.sub([
            t_git_push_to_fountain_pen.Error($)
        ]))
        default: return _p.au($[0])
    }
})