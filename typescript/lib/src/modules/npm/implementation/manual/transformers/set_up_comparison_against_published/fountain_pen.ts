import * as p_ from 'pareto-core/dist/implementation/transformer'
import * as p_i from 'pareto-core/dist/interface/transformer'

import * as d_in from "../../../../interface/data/set_up_comparison_against_published"
import * as d_out from "pareto-fountain-pen/dist/interface/generated/liana/schemas/prose/data"

export type Error = p_i.Transformer<
d_in.Error, d_out.Phrase
>

import * as sh from "pareto-fountain-pen/dist/shorthands/prose/deprecated"

import * as t_epe_to_fountain_pen from "pareto-resources/dist/implementation/manual/transformers/execute_command_executable/fountain_pen"
import * as t_eqe_to_fountain_pen from "pareto-resources/dist/implementation/manual/transformers/execute_query_executable/fountain_pen"
import * as t_make_directory_to_fountain_pen from "pareto-resources/dist/implementation/manual/transformers/make_directory/fountain_pen"
import * as t_get_package_json_to_fountain_pen from "../get_package_json/fountain_pen"


export const Error: Error = ($) => {
    return p_.from.state($).decide(
        ($): d_out.Phrase => {
            switch ($[0]) {
                case 'error while running npm command': return p_.ss($, ($) => sh.ph.composed([
                    sh.ph.literal("error while running npm command: "),
                    sh.ph.indent(
sh.pg.sentences([
                        sh.sentence([
                            t_epe_to_fountain_pen.Error($)
                        ])
                    ])),
                ]))
                case 'error while running npm query': return p_.ss($, ($) => sh.ph.composed([
                    sh.ph.literal("error while running npm query: "),
                    sh.ph.indent(
sh.pg.sentences([
                        sh.sentence([
                            t_eqe_to_fountain_pen.Error($)
                        ])
                    ])),
                ]))
                case 'error while running tar': return p_.ss($, ($) => sh.ph.composed([
                    sh.ph.literal("error while running tar: "),
                    sh.ph.indent(
sh.pg.sentences([
                        sh.sentence([
                            t_epe_to_fountain_pen.Error($)
                        ])
                    ])),
                ]))
                case 'error while creating directory': return p_.ss($, ($) => sh.ph.composed([
                    sh.ph.literal("error while creating directory: "),
                    sh.ph.indent(
sh.pg.sentences([
                        sh.sentence([
                            t_make_directory_to_fountain_pen.Error($)
                        ])
                    ])),
                ]))
                case 'error while getting package.json': return p_.ss($, ($) => t_get_package_json_to_fountain_pen.Error($))
                default: return p_.au($[0])
            }
        })
}