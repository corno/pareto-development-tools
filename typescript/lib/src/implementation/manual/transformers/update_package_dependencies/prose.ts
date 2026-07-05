import * as p_ from 'pareto-core/dist/implementation/transformer'
import * as p_i from 'pareto-core/dist/interface/transformer'

import * as d_in from "../../../../interface/data/update_package_dependencies"
import * as d_out from "pareto-fountain-pen/dist/interface/generated/liana/schemas/prose/data"

import * as sh from "pareto-fountain-pen/dist/shorthands/prose/deprecated"

export type Error = p_i.Transformer<
    d_in.Error,
    d_out.Phrase
>

//dependencies
import * as t_stat_possible_node_to_prose from "pareto-resources/dist/implementation/manual/transformers/stat_possible_node/prose"
import * as t_utd_to_prose from "../../../../modules/npm/implementation/manual/transformers/update_package_dependencies/prose"

export const Error: Error = ($) => p_.from.state($).decide(
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
            default: return p_.au($[0])
        }
    })