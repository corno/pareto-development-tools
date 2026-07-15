import * as p_ from 'pareto-core/implementation/transformer'

//schemas
import type * as s_in from "../../../interface/schemas/update_package_dependencies.js"
import type * as s_out from "../../../interface/schemas/paragraph.js"

namespace declarations {

    export type Error = p_.Transformer<
        s_in.Error,
        s_out.Phrase
    >
}

//shorthands
import * as sh from "pareto-fountain-pen/shorthands/paragraph/deprecated"

//dependencies
import * as t_u2l_to_prose from "../update2latest/paragraph.js"
import * as ser_remove from "pareto-filesystem-unrestricted-api/implementation/serializers/remove"
import * as t_npm_to_prose from "../npm/paragraph.js"

export const Error: declarations.Error = ($) => {
    return p_.from.state($).decide(
        ($) => {
            switch ($[0]) {
                case 'could not remove node_modules': return p_.option($, ($) => sh.ph.composed([
                    sh.ph.text("could not remove node_modules: "),
                    sh.ph.text(ser_remove.Error($))
                ]))
                case 'could not remove package-lock.json': return p_.option($, ($) => sh.ph.composed([
                    sh.ph.text("could not remove package-lock.json: "),
                    sh.ph.text(ser_remove.Error($))
                ]))
                case 'could not update to latest': return p_.option($, ($) => sh.ph.composed([
                    sh.ph.text("could not update to latest typescript dependencies: "),
                    t_u2l_to_prose.Error($)
                ]))
                case 'could not install dependencies': return p_.option($, ($) => sh.ph.composed([
                    sh.ph.text("could not install dependencies typescript dependencies: "),
                    t_npm_to_prose.Error($)
                ]))
                default: return p_.exhaustive($[0])
            }
        })
}