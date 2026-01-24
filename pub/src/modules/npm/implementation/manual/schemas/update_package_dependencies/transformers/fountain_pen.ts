import * as _p from 'pareto-core/dist/transformer'
import * as _pi from 'pareto-core/dist/interface'

import * as d_in from "../../../../../interface/to_be_generated/update_package_dependencies"
import * as d_out from "pareto-fountain-pen/dist/interface/generated/liana/schemas/block/data"

export type Error = _pi.Transformer<d_in.Error, d_out.Block_Part>

import * as sh from "pareto-fountain-pen/dist/shorthands/block"

import * as t_u2l_to_fountain_pen from "../../update2latest/transformers/fountain_pen"
import * as t_remove_to_fountain_pen from "pareto-resources/dist/implementation/manual/schemas/remove/transformers/fountain_pen"
import * as t_npm_to_fountain_pen from "../../npm/transformers/fountain_pen"

export const Error: Error = ($) => {
    return _p.decide.state($, ($) => {
        switch ($[0]) {
            case 'could not remove node_modules': return _p.ss($, ($) => sh.b.sub([
                sh.b.snippet(`could not remove node_modules: `),
                t_remove_to_fountain_pen.Error($)
            ]))
            case 'could not remove package-lock.json': return _p.ss($, ($) => sh.b.sub([
                sh.b.snippet(`could not remove package-lock.json: `),
                t_remove_to_fountain_pen.Error($)
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