import * as p_ from 'pareto-core/implementation/transformer'

//schemas
import type * as s_in from "../../../schemas/update_package_dependencies.js"
import type * as s_out from "pareto-fountain-pen/modules/paragraph/schemas/paragraph/schema"

namespace declarations {
    export type Error = p_.Transformer<
        s_in.Error,
        s_out.Phrase
    >
}

//dependencies
import * as ser_stat_possible_node from "pareto-filesystem-unrestricted-api/modules/unrestricted/implementation/serializers/stat_possible_node"
import * as t_utd_to_paragraph from "../../../submodules/npm/implementation/transformers/update_package_dependencies/paragraph.js"

//shorthands
import * as sh from "pareto-fountain-pen/modules/paragraph/schemas/paragraph/shorthands/deprecated"

export const Error: declarations.Error = ($) => p_.from.state($).decide(
    ($) => {
        switch ($[0]) {
            case 'error updating lib': return p_.option($, ($) => sh.ph.composed([
                sh.ph.text("error updating /lib: "),
                t_utd_to_paragraph.Error($)
            ]))
            case 'error updating test': return p_.option($, ($) => sh.ph.composed([
                sh.ph.text("error updating /test: "),
                t_utd_to_paragraph.Error($)
            ]))
            case 'error updating app': return p_.option($, ($) => sh.ph.composed([
                sh.ph.text("error updating /app: "),
                t_utd_to_paragraph.Error($)
            ]))
            case 'error statting app dir': return p_.option($, ($) => sh.ph.composed([
                sh.ph.text("error statting /app directory: "),
                sh.ph.text(ser_stat_possible_node.Error($))
            ]))
            default: return p_.exhaustive($[0])
        }
    })