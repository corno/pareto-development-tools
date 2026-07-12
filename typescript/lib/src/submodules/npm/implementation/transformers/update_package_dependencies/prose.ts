import * as p_ from 'pareto-core/implementation/transformer'
import type * as p_i from 'pareto-core/interface/transformer'

//schemas
import type * as s_in from "../../../interface/schemas/update_package_dependencies.js"

import type * as s_out from "../../../interface/schemas/prose.js"
namespace declarations {

    export type Error = p_i.Transformer<
        s_in.Error,
        s_out.Phrase
    >
}

//shorthands
import * as sh from "pareto-fountain-pen/shorthands/prose/deprecated"

//dependencies
import * as t_u2l_to_prose from "../update2latest/prose.js"
import * as t_remove_to_prose from "pareto-filesystem-unrestricted-api/implementation/transformers/remove/prose"
import * as t_npm_to_prose from "../npm/prose.js"

export const Error: declarations.Error = ($) => {
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
                default: return p_.exhaustive($[0])
            }
        })
}