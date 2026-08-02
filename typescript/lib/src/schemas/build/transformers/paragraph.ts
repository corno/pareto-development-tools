import * as p_ from 'pareto-core/implementation/transformer'

//schemas
import type * as s_in from "../schema.js"
import type * as s_out from "pareto-fountain-pen/modules/paragraph/schemas/paragraph/schema"

namespace declarations {
    export type Error = p_.Transformer_With_Parameter<
        s_in.Error,
        s_out.Phrase,
        {
            'concise': boolean
        }
    >
}

//shorthands
import * as sh from "pareto-fountain-pen/modules/paragraph/schemas/paragraph/shorthands/deprecated"

//dependencies
import * as t_tsc_to_paragraph from "../../../schemas/tsc/transformers/paragraph.js"
import * as ser_remove from "pareto-filesystem-unrestricted-api/modules/unrestricted/schemas/remove/serializers"
import * as ser_path from "pareto-resources/schemas/fs_unrestricted_path/serializers"
import * as ser_stat_possible_node from "pareto-filesystem-unrestricted-api/modules/unrestricted/schemas/stat_possible_node/serializers"
import * as ser_chmod from "pareto-filesystem-unrestricted-api/modules/unrestricted/schemas/chmod/serializers"

export const Error: declarations.Error = ($, $p) => p_.from.state($).decide(
    ($) => {
        switch ($[0]) {
            case 'error removing lib dist dir': return p_.option($, ($) => sh.ph.composed([
                sh.ph.text("could not remove lib dist dir: ("),
                sh.ph.text(ser_path.Context_Path($.path)),
                sh.ph.text("/lib)"),

                sh.ph.indent(
                    sh.pg.sentences([
                        sh.sentence([
                            sh.ph.text(ser_remove.Error($.error))
                        ])
                    ])
                )

            ]))
            case 'error building lib': return p_.option($, ($) => sh.ph.composed([
                sh.ph.text("could not build lib: ("),
                sh.ph.text(ser_path.Context_Path($.path)),
                sh.ph.text(")"),
                sh.ph.indent(
                    t_tsc_to_paragraph.Error($.error, $p)
                )
            ]))
            case 'error removing test dist dir': return p_.option($, ($) => sh.ph.composed([
                sh.ph.text("could not remove test dist dir: ("),
                sh.ph.text(ser_path.Context_Path($.path)),
                sh.ph.text("/test)"),
                sh.ph.indent(
                    sh.pg.sentences([
                        sh.sentence([
                            sh.ph.text(ser_remove.Error($.error))
                        ])
                    ])
                )
            ]))
            case 'error building test': return p_.option($, ($) => sh.ph.composed([
                sh.ph.text("could not build test: ("),
                sh.ph.text(ser_path.Context_Path($.path)),
                sh.ph.text(")"),
                sh.ph.indent(
                    t_tsc_to_paragraph.Error($.error, $p)
                )
            ]))
            case 'error statting app dir': return p_.option($, ($) => sh.ph.composed([
                sh.ph.text("error statting /app directory: "),
                sh.ph.text(ser_stat_possible_node.Error($))
            ]))
            case 'error removing app dist dir': return p_.option($, ($) => sh.ph.composed([
                sh.ph.text("could not remove app dist dir: ("),
                sh.ph.text(ser_path.Context_Path($.path)),
                sh.ph.text("/app)"),
                sh.ph.indent(
                    sh.pg.sentences([
                        sh.sentence([
                            sh.ph.text(ser_remove.Error($.error))
                        ])
                    ])
                )
            ]))
            case 'error building app': return p_.option($, ($) => sh.ph.composed([
                sh.ph.text("could not build app: ("),
                sh.ph.text(ser_path.Context_Path($.path)),
                sh.ph.text(")"),
                sh.ph.indent(
                    t_tsc_to_paragraph.Error($.error, $p)
                )
            ]))
            case 'error setting permissions on app dist bin.js': return p_.option($, ($) => sh.ph.composed([
                sh.ph.text("could not set permissions on app dist bin.js: ("),
                sh.ph.text(ser_path.Context_Path($.path)),
                sh.ph.text(")"),
                sh.ph.text(ser_chmod.Error($.error))
            ]))
            default: return p_.exhaustive($[0])
        }
    })