import * as p_ from 'pareto-core/implementation/serializer'

import type * as s_in from "../../interface/schemas/set_up_comparison_against_published.js"


namespace declarations {

    export type Error = p_.Phrase_Serializer<
        s_in.Error
    >
}

//shorthands
import * as sh from "pareto-fountain-pen/shorthands/prose/deprecated"

//dependencies
import * as t_epe_to_prose from "pareto-resources/implementation/serializers/execute_command_executable"
import * as t_eqe_to_prose from "pareto-resources/implementation/serializers/execute_query_executable"
import * as t_make_directory_to_prose from "pareto-filesystem-unrestricted-api/implementation/serializers/make_directory"
import * as t_get_package_json_to_prose from "./get_package_json.js"


export const Error: declarations.Error = ($) => {
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