import * as p_ from 'pareto-core/implementation/transformer'
import * as p_i from 'pareto-core/interface/transformer'

import * as d_in from "../../../../interface/data/update_package_dependencies.js"
import * as d_out from "pareto-fountain-pen/interface/generated/liana/schemas/prose/data"

export type Error = p_i.Transformer<
    d_in.Error,
    d_out.Phrase
>

import * as sh from "pareto-fountain-pen/shorthands/prose/deprecated"

import * as t_u2l_to_prose from "../update2latest/prose.js"
import * as t_remove_to_prose from "pareto-filesystem-unrestricted-api/implementation/manual/transformers/remove/prose"
import * as t_npm_to_prose from "../npm/prose.js"

export const Error: Error = ($) => {
    return p_.from.state($).decide(
        ($) => {
            switch ($[0]) {
                case 'could not remove node_modules': return p_.option($, ($) => sh.ph.composed([
                    sh.ph.literal("could not remove node_modules: "),
                    t_remove_to_prose.Error($)
                ]))
                case 'could not remove package-lock.json': return p_.option($, ($) => sh.ph.composed([
                    sh.ph.literal("could not remove package-lock.json: "),
                    t_remove_to_prose.Error($)
                ]))
                case 'could not update to latest': return p_.option($, ($) => sh.ph.composed([
                    sh.ph.literal("could not update to latest typescript dependencies: "),
                    t_u2l_to_prose.Error($)
                ]))
                case 'could not install dependencies': return p_.option($, ($) => sh.ph.composed([
                    sh.ph.literal("could not install dependencies typescript dependencies: "),
                    t_npm_to_prose.Error($)
                ]))
                default: return p_.au($[0])
            }
        })
}