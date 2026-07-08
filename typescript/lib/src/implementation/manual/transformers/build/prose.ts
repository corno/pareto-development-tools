import * as p_ from 'pareto-core/implementation/transformer'
import * as p_i from 'pareto-core/interface/transformer'

import type * as d_in from "../../../../interface/data/build.js"
import type * as d_out from "pareto-fountain-pen/interface/generated/liana/schemas/prose/data"

export namespace signatures {
    export type Error = p_i.Transformer_With_Parameter<
        d_in.Error,
        d_out.Phrase,
        {
            'concise': boolean
        }
    >
}

//shorthands
import * as sh from "pareto-fountain-pen/shorthands/prose/deprecated"

//dependencies
import * as t_tsc_to_prose from "../tsc/prose.js"
import * as t_remove_to_prose from "pareto-filesystem-unrestricted-api/implementation/manual/transformers/remove/prose"
import * as t_path_to_loc from "pareto-resources/implementation/manual/transformers/unrestricted_path/deprecated_list_of_characters"
import * as t_stat_possible_node_to_prose from "pareto-filesystem-unrestricted-api/implementation/manual/transformers/stat_possible_node/prose"
import * as t_chmod_to_prose from "pareto-filesystem-unrestricted-api/implementation/manual/transformers/chmod/prose"

export const Error: signatures.Error = ($, $p) => p_.from.state($).decide(
    ($) => {
        switch ($[0]) {
            case 'error removing lib dist dir': return p_.option($, ($) => sh.ph.composed([
                sh.ph.literal("could not remove lib dist dir: ("),
                sh.ph.serialize(t_path_to_loc.Context_Path($.path)),
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
                sh.ph.serialize(t_path_to_loc.Context_Path($.path)),
                sh.ph.literal(")"),
                sh.ph.indent(
                    t_tsc_to_prose.Error($.error, $p)
                )
            ]))
            case 'error removing test dist dir': return p_.option($, ($) => sh.ph.composed([
                sh.ph.literal("could not remove test dist dir: ("),
                sh.ph.serialize(t_path_to_loc.Context_Path($.path)),
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
                sh.ph.serialize(t_path_to_loc.Context_Path($.path)),
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
                sh.ph.serialize(t_path_to_loc.Context_Path($.path)),
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
                sh.ph.serialize(t_path_to_loc.Context_Path($.path)),
                sh.ph.literal(")"),
                sh.ph.indent(
                    t_tsc_to_prose.Error($.error, $p)
                )
            ]))
            case 'error setting permissions on app dist bin.js': return p_.option($, ($) => sh.ph.composed([
                sh.ph.literal("could not set permissions on app dist bin.js: ("),
                sh.ph.serialize(t_path_to_loc.Context_Path($.path)),
                sh.ph.literal(")"),
                t_chmod_to_prose.Error($.error)
            ]))
            default: return p_.exhaustive($[0])
        }
    })