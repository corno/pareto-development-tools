import * as p_ from 'pareto-core/implementation/transformer'
import * as p_i from 'pareto-core/interface/transformer'

import * as d_in from "../../../../interface/data/make_pristine.js"
import * as d_out from "pareto-fountain-pen/interface/generated/liana/schemas/prose/data"

import * as sh from "pareto-fountain-pen/shorthands/prose/deprecated"

import * as t_epe_to_prose from "pareto-resources/implementation/manual/transformers/execute_command_executable/prose"

export type Error = p_i.Transformer<
    d_in.Error,
    d_out.Phrase
>

export const Error: Error = ($) => p_.from.state($).decide(
    ($) => {
        switch ($[0]) {
            case 'unexpected error': return p_.option($, ($) => sh.ph.composed([
                sh.ph.literal("unexpected error:"),
                t_epe_to_prose.Error($)
            ]))
            default: return p_.au($[0])
        }
    })