import * as p_ from 'pareto-core/implementation/serializer'

//schemas
import type * as s_in from "../../interface/schemas/update_package_dependencies.js"

namespace declarations {

    export type Error = p_.Phrase_Serializer<
        s_in.Error
    >
}

//shorthands
import * as sh from "pareto-fountain-pen/shorthands/prose_simple/deprecated"

//dependencies
import * as t_u2l_to_prose from "./update2latest.js"
import * as t_remove_to_prose from "pareto-filesystem-unrestricted-api/implementation/serializers/remove"
import * as t_npm_to_prose from "./npm.js"

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