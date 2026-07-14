import * as p_ from 'pareto-core/implementation/serializer'

//schemas
import type * as s_in from "../../interface/schemas/update_package_dependencies.js"

namespace declarations {
    export type Error = p_.Phrase_Serializer<
        s_in.Error
    >
}

//dependencies
import * as t_stat_possible_node_to_prose from "pareto-filesystem-unrestricted-api/implementation/serializers/stat_possible_node"
import * as t_utd_to_prose from "../../submodules/npm/implementation/serializers/update_package_dependencies.js"

//shorthands
import * as sh from "pareto-fountain-pen/shorthands/prose/deprecated"

export const Error: declarations.Error = ($) => p_.from.state($).decide(
    ($) => {
        switch ($[0]) {
            case 'error updating lib': return p_.option($, ($) => sh.ph.composed([
                sh.ph.literal("error updating /lib: "),
                t_utd_to_prose.Error($)
            ]))
            case 'error updating test': return p_.option($, ($) => sh.ph.composed([
                sh.ph.literal("error updating /test: "),
                t_utd_to_prose.Error($)
            ]))
            case 'error updating app': return p_.option($, ($) => sh.ph.composed([
                sh.ph.literal("error updating /app: "),
                t_utd_to_prose.Error($)
            ]))
            case 'error statting app dir': return p_.option($, ($) => sh.ph.composed([
                sh.ph.literal("error statting /app directory: "),
                t_stat_possible_node_to_prose.Error($)
            ]))
            default: return p_.exhaustive($[0])
        }
    })