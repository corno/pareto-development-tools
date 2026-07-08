import * as p_ from 'pareto-core/implementation/transformer'
import type * as p_i from 'pareto-core/interface/transformer'

import type * as d_in from "../../../../interface/data/set_up_comparison_against_published.js"
import type * as d_out from "pareto-fountain-pen/interface/generated/liana/schemas/prose/data"

export namespace interface_ {

    export type Error = p_i.Transformer<
        d_in.Error, d_out.Phrase
    >
}

//shorthands
import * as sh from "pareto-fountain-pen/shorthands/prose/deprecated"

//dependencies
import * as t_epe_to_prose from "pareto-resources/implementation/manual/transformers/execute_command_executable/prose"
import * as t_eqe_to_prose from "pareto-resources/implementation/manual/transformers/execute_query_executable/prose"
import * as t_make_directory_to_prose from "pareto-filesystem-unrestricted-api/implementation/manual/transformers/make_directory/prose"
import * as t_get_package_json_to_prose from "../get_package_json/prose.js"


export const Error: interface_.Error = ($) => {
    return p_.from.state($).decide(
        ($) => {
            switch ($[0]) {
                case 'error while running npm command': return p_.option($, ($) => sh.ph.composed([
                    sh.ph.literal("error while running npm command: "),
                    sh.ph.indent(
                        sh.pg.sentences([
                            sh.sentence([
                                t_epe_to_prose.Error($)
                            ])
                        ])),
                ]))
                case 'error while running npm query': return p_.option($, ($) => sh.ph.composed([
                    sh.ph.literal("error while running npm query: "),
                    sh.ph.indent(
                        sh.pg.sentences([
                            sh.sentence([
                                t_eqe_to_prose.Error($)
                            ])
                        ])),
                ]))
                case 'error while running tar': return p_.option($, ($) => sh.ph.composed([
                    sh.ph.literal("error while running tar: "),
                    sh.ph.indent(
                        sh.pg.sentences([
                            sh.sentence([
                                t_epe_to_prose.Error($)
                            ])
                        ])),
                ]))
                case 'error while creating directory': return p_.option($, ($) => sh.ph.composed([
                    sh.ph.literal("error while creating directory: "),
                    sh.ph.indent(
                        sh.pg.sentences([
                            sh.sentence([
                                t_make_directory_to_prose.Error($)
                            ])
                        ])),
                ]))
                case 'error while getting package.json': return p_.option($, ($) => t_get_package_json_to_prose.Error($))
                default: return p_.exhaustive($[0])
            }
        }
    )
}