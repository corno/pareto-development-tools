import * as p_ from 'pareto-core/dist/implementation/transformer'
import * as p_i from 'pareto-core/dist/interface/transformer'

import * as d_in from "../../../../interface/data/update_package_dependencies"
import * as d_out from "pareto-fountain-pen/dist/interface/generated/liana/schemas/prose/data"

export type Error = p_i.Transformer<d_in.Error, d_out.Phrase>

import * as sh from "pareto-fountain-pen/dist/shorthands/prose"

import * as t_u2l_to_fountain_pen from "../update2latest/fountain_pen"
import * as t_remove_to_fountain_pen from "pareto-resources/dist/implementation/manual/transformers/remove/fountain_pen"
import * as t_npm_to_fountain_pen from "../npm/fountain_pen"

export const Error: Error = ($) => {
    return p_.from.state($).decide(($) => {
        switch ($[0]) {
            case 'could not remove node_modules': return p_.ss($, ($) => sh.ph.composed([
                sh.ph.literal("could not remove node_modules: "),
                t_remove_to_fountain_pen.Error($)
            ]))
            case 'could not remove package-lock.json': return p_.ss($, ($) => sh.ph.composed([
                sh.ph.literal("could not remove package-lock.json: "),
                t_remove_to_fountain_pen.Error($)
            ]))
            case 'could not update to latest': return p_.ss($, ($) => sh.ph.composed([
                sh.ph.literal("could not update to latest typescript dependencies: "),
                t_u2l_to_fountain_pen.Error($)
            ]))
            case 'could not install dependencies': return p_.ss($, ($) => sh.ph.composed([
                sh.ph.literal("could not install dependencies typescript dependencies: "),
                t_npm_to_fountain_pen.Error($)
            ]))
            default: return p_.au($[0])
        }
    })
}