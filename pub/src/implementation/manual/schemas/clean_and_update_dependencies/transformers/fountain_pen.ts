import * as _p from 'pareto-core-transformer'
import * as _pi from 'pareto-core-interface'

import * as d_in from "../../../../../interface/to_be_generated/clean_and_update_dependencies"
import * as d_out from "pareto-fountain-pen/dist/interface/generated/pareto/schemas/block/data_types/target"

export type Error = _pi.Transformer<d_in.Error, d_out.Block_Part>

import * as sh from "pareto-fountain-pen/dist/shorthands/block"

import * as t_u2l_to_fountain_pen from "../../../../../modules/npm/implementation/manual/schemas/update2latest/transformers/fountain_pen"
import * as t_git_clean_to_fountain_pen from "../../../../../modules/git/implementation/manual/schemas/clean/transformers/fountain_pen"
import * as t_npm_to_fountain_pen from "../../../../../modules/npm/implementation/manual/schemas/npm/transformers/fountain_pen"

export const Error: Error = ($) => {
    return _p.cc($, ($) => {
        switch ($[0]) {
            case 'could not clean': return _p.ss($, ($) => sh.b.sub([
                sh.b.snippet(`could not clean typescript dependencies: `),
                t_git_clean_to_fountain_pen.Error($)
            ]))
            case 'could not update to latest': return _p.ss($, ($) => sh.b.sub([
                sh.b.snippet(`could not update to latest typescript dependencies: `),
                t_u2l_to_fountain_pen.Error($)
            ]))
            case 'could not install dependencies': return _p.ss($, ($) => sh.b.sub([
                sh.b.snippet(`could not install dependencies typescript dependencies: `),
                t_npm_to_fountain_pen.Error($)
            ]))
            default: return _p.au($[0])
        }
    })
}