import * as p_ from 'pareto-core/implementation/transformer'

import type * as s_in from "../../../schemas/set_up_comparison_against_published.js"
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
import * as t_epe_to_prose from "pareto-resources/schemas/execute_unrestricted_command_executable/transformers/paragraph"
import * as t_eqe_to_prose from "pareto-resources/schemas/execute_sandboxed_query_executable/transformers//paragraph"
import * as ser_make_directory from "pareto-filesystem-unrestricted-api/modules/unrestricted/schemas/make_directory/serializers"
import * as t_get_package_json_to_prose from "../get_package_json/paragraph.js"


export const Error: declarations.Error = ($) => {
    return p_.from.state($).decide(
        ($) => {
            switch ($[0]) {
                case 'error while running npm command': return p_.option($, ($) => sh.ph.composed([
                    sh.ph.text("error while running npm command: "),
                    sh.ph.indent(
                        sh.pg.sentences([
                            sh.sentence([
                                t_epe_to_prose.Error($)
                            ])
                        ])),
                ]))
                case 'error while running npm query': return p_.option($, ($) => sh.ph.composed([
                    sh.ph.text("error while running npm query: "),
                    sh.ph.indent(
                        sh.pg.sentences([
                            sh.sentence([
                                t_eqe_to_prose.Error($)
                            ])
                        ])),
                ]))
                case 'error while running tar': return p_.option($, ($) => sh.ph.composed([
                    sh.ph.text("error while running tar: "),
                    sh.ph.indent(
                        sh.pg.sentences([
                            sh.sentence([
                                t_epe_to_prose.Error($)
                            ])
                        ])),
                ]))
                case 'error while creating directory': return p_.option($, ($) => sh.ph.composed([
                    sh.ph.text("error while creating directory: "),
                    sh.ph.indent(
                        sh.pg.sentences([
                            sh.sentence([
                                sh.ph.text(ser_make_directory.Error($))
                            ])
                        ])),
                ]))
                case 'error while getting package.json': return p_.option($, ($) => t_get_package_json_to_prose.Error($))
                default: return p_.exhaustive($[0])
            }
        }
    )
}