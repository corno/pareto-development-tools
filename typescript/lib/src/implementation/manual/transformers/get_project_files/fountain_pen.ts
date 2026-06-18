import * as p_ from 'pareto-core/dist/implementation/transformer'
import * as p_i from 'pareto-core/dist/interface/transformer'

import * as d_in from "../../../../interface/data/get_project_files"
import * as d_out from "pareto-fountain-pen/dist/interface/generated/liana/schemas/prose/data"

export type Error = p_i.Transformer<d_in.Error, d_out.Phrase>

import * as sh from "pareto-fountain-pen/dist/shorthands/prose"

import * as t_read_directory_content_to_fountain_pen from "pareto-resources/dist/implementation/manual/transformers/read_directory_content/fountain_pen"
import * as t_read_directory_to_fountain_pen from "pareto-resources/dist/implementation/manual/transformers/read_directory/fountain_pen"

export const Error: Error = ($) => p_.from.state($).decide(($) => {
    switch ($[0]) {
        case 'log': return p_.ss($, ($) => sh.ph.composed([
            sh.ph.literal("log: "),
            sh.ph.indent(
                sh.pg.sentences([
                    // t_tsc_to_fountain_pen.Error($)
                ])
            )
        ]))
        case 'directory content processing': return p_.ss($, ($) => sh.ph.composed([
            sh.ph.literal("directory content processing: "),
            sh.ph.indent(
                sh.pg.sentences(p_.from.dictionary(
                    $,
                ).convert_to_list(
                    ($, id) => sh.sentence([
                        sh.ph.literal(id),
                        sh.ph.literal(":"),
                        p_.from.state($).decide(($) => {
                            switch ($[0]) {
                                case 'not a directory': return p_.ss($, ($) => sh.ph.literal("not a directory"))
                                case 'directory content': return p_.ss($, ($) => t_read_directory_content_to_fountain_pen.Error($))
                                default: return p_.au($[0])
                            }
                        })

                    ])))
            )
        ]))
        case 'read directory': return p_.ss($, ($) => sh.ph.composed([
            t_read_directory_to_fountain_pen.Error($)
        ]))
        default: return p_.au($[0])
    }
})