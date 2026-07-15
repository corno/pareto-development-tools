import * as p_ from 'pareto-core/implementation/serializer'

//schemas
import type * as s_in from "../../interface/schemas/build.js"

namespace declarations {
    export type Error = p_.Phrase_Serializer_With_Parameter<
        s_in.Error,
        {
        'concise': boolean
    }
    >
}

//shorthands
import * as sh from "pareto-fountain-pen/shorthands/prose_extended/deprecated"

//dependencies
import * as t_tsc_to_prose from "../transformers/tsc/prose.js"
import * as t_remove_to_prose from "pareto-filesystem-unrestricted-api/implementation/serializers/remove"
import * as ser_path from "pareto-resources/implementation/serializers/unrestricted_path"
import * as t_stat_possible_node_to_prose from "pareto-filesystem-unrestricted-api/implementation/serializers/stat_possible_node"
import * as t_chmod_to_prose from "pareto-filesystem-unrestricted-api/implementation/serializers/chmod"

export const Error: declarations.Error = ($, $p) => p_.from.state($).decide(
    ($) => {
        switch ($[0]) {
            case 'error removing lib dist dir': return p_.option($, ($) => sh.ph.composed([
                sh.ph.literal("could not remove lib dist dir: ("),
                ser_path.Context_Path($.path),
                sh.ph.literal("/lib)"),

                sh.ph.indent(
                    sh.pg.sentences([
                        sh.sentence([
                            t_remove_to_prose.Error($.error)
                        ])
                    ])
                )

            ]))
            case 'error building lib': return p_.option($, ($) => sh.ph.composed([
                sh.ph.literal("could not build lib: ("),
                ser_path.Context_Path($.path),
                sh.ph.literal(")"),
                sh.ph.indent(
                    t_tsc_to_prose.Error($.error, $p)
                )
            ]))
            case 'error removing test dist dir': return p_.option($, ($) => sh.ph.composed([
                sh.ph.literal("could not remove test dist dir: ("),
                ser_path.Context_Path($.path),
                sh.ph.literal("/test)"),
                sh.ph.indent(
                    sh.pg.sentences([
                        sh.sentence([
                            t_remove_to_prose.Error($.error)
                        ])
                    ])
                )
            ]))
            case 'error building test': return p_.option($, ($) => sh.ph.composed([
                sh.ph.literal("could not build test: ("),
                ser_path.Context_Path($.path),
                sh.ph.literal(")"),
                sh.ph.indent(
                    t_tsc_to_prose.Error($.error, $p)
                )
            ]))
            case 'error statting app dir': return p_.option($, ($) => sh.ph.composed([
                sh.ph.literal("error statting /app directory: "),
                t_stat_possible_node_to_prose.Error($)
            ]))
            case 'error removing app dist dir': return p_.option($, ($) => sh.ph.composed([
                sh.ph.literal("could not remove app dist dir: ("),
                ser_path.Context_Path($.path),
                sh.ph.literal("/app)"),
                sh.ph.indent(
                    sh.pg.sentences([
                        sh.sentence([
                            t_remove_to_prose.Error($.error)
                        ])
                    ])
                )
            ]))
            case 'error building app': return p_.option($, ($) => sh.ph.composed([
                sh.ph.literal("could not build app: ("),
                ser_path.Context_Path($.path),
                sh.ph.literal(")"),
                sh.ph.indent(
                    t_tsc_to_prose.Error($.error, $p)
                )
            ]))
            case 'error setting permissions on app dist bin.js': return p_.option($, ($) => sh.ph.composed([
                sh.ph.literal("could not set permissions on app dist bin.js: ("),
                ser_path.Context_Path($.path),
                sh.ph.literal(")"),
                t_chmod_to_prose.Error($.error)
            ]))
            default: return p_.exhaustive($[0])
        }
    })