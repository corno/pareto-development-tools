import * as p_ from 'pareto-core/transformer'

//schemas
import type * as s_in from "../schema.js"
import type * as s_out from "pareto-fountain-pen/modules/paragraph/schemas/paragraph/schema"

namespace declarations {

    export type Error = p_.Transformer<
        s_in.Error,
        s_out.Phrase
    >
}

//shorthands
import * as sh from "pareto-fountain-pen/modules/paragraph/schemas/paragraph/shorthands/deprecated"

//dependencies
import * as t_u2l_to_paragraph from "../../update2latest/transformers/paragraph.js"
import * as ser_remove from "pareto-filesystem-unrestricted-api/modules/unrestricted/schemas/remove/serializers"
import * as t_npm_to_paragraph from "../../npm_tool/transformers/paragraph.js"

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
                    t_u2l_to_paragraph.Error($)
                ]))
                case 'could not install dependencies': return p_.option($, ($) => sh.ph.composed([
                    sh.ph.text("could not install dependencies typescript dependencies: "),
                    t_npm_to_paragraph.Error($)
                ]))
                default: return p_.exhaustive($[0])
            }
        })
}