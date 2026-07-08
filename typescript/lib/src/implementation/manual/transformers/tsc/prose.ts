import * as p_ from 'pareto-core/implementation/transformer'
import * as p_i from 'pareto-core/interface/transformer'

import * as d_in from "../../../../interface/data/tsc.js"
import * as d_out from "pareto-fountain-pen/interface/generated/liana/schemas/prose/data"

import * as t_espe_to_prose from "pareto-resources/implementation/manual/transformers/execute_smelly_command_executable/prose"

export type Error = p_i.Transformer_With_Parameter<
    d_in.Error,
    d_out.Paragraph,
    {
        'concise': boolean
    }
>

import * as sh from "pareto-fountain-pen/shorthands/prose/deprecated"

export const Error: Error = ($, $p) => p_.from.state($).decide(
    ($): d_out.Paragraph => {
        switch ($[0]) {
            case 'error while running tsc': return p_.option($, ($) => $p.concise
                ? sh.pg.composed([])
                : sh.pg.sentences([
                    sh.sentence([
                        sh.ph.literal("error while running tsc: "),
                    ]),
                    sh.sentence([
                        t_espe_to_prose.Error($),
                    ]),
                    //
                ])
            )
            default: return p_.exhaustive($[0])
        }
    })