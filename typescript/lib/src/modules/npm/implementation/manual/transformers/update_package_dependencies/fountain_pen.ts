import * as pt from 'pareto-core/dist/assign'
import * as pi from 'pareto-core/dist/interface'

import * as d_in from "../../../../interface/to_be_generated/update_package_dependencies"
import * as d_out from "pareto-fountain-pen/dist/interface/generated/liana/schemas/prose/data"

export type Error = pi.Transformer<d_in.Error, d_out.Phrase>

import * as sh from "pareto-fountain-pen/dist/shorthands/prose"

import * as t_u2l_to_fountain_pen from "../update2latest/fountain_pen"
import * as t_remove_to_fountain_pen from "pareto-resources/dist/implementation/manual/transformers/remove/fountain_pen"
import * as t_npm_to_fountain_pen from "../npm/fountain_pen"

export const Error: Error = ($) => {
    return pt.decide.state($, ($) => {
        switch ($[0]) {
            case 'could not remove node_modules': return pt.ss($, ($) => sh.ph.composed([
                sh.ph.literal("could not remove node_modules: "),
                t_remove_to_fountain_pen.Error($)
            ]))
            case 'could not remove package-lock.json': return pt.ss($, ($) => sh.ph.composed([
                sh.ph.literal("could not remove package-lock.json: "),
                t_remove_to_fountain_pen.Error($)
            ]))
            case 'could not update to latest': return pt.ss($, ($) => sh.ph.composed([
                sh.ph.literal("could not update to latest typescript dependencies: "),
                t_u2l_to_fountain_pen.Error($)
            ]))
            case 'could not install dependencies': return pt.ss($, ($) => sh.ph.composed([
                sh.ph.literal("could not install dependencies typescript dependencies: "),
                t_npm_to_fountain_pen.Error($)
            ]))
            default: return pt.au($[0])
        }
    })
}