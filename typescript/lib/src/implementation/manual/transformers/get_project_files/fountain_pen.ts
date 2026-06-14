import * as pt from 'pareto-core/dist/assign'
import * as p_di from 'pareto-core/dist/data/interface'
import * as p_ti from 'pareto-core/dist/transformer/interface'

import * as d_in from "../../../../interface/to_be_generated/get_project_files"
import * as d_out from "pareto-fountain-pen/dist/interface/generated/liana/schemas/prose/data"

export type Error = p_ti.Transformer<d_in.Error, d_out.Phrase>

import * as sh from "pareto-fountain-pen/dist/shorthands/prose"

import * as t_read_directory_content_to_fountain_pen from "pareto-resources/dist/implementation/manual/transformers/read_directory_content/fountain_pen"
import * as t_read_directory_to_fountain_pen from "pareto-resources/dist/implementation/manual/transformers/read_directory/fountain_pen"

export const Error: Error = ($) => pt.decide.state($, ($) => {
    switch ($[0]) {
        case 'log': return pt.ss($, ($) => sh.ph.composed([
            sh.ph.literal("log: "),
            sh.ph.indent(
                sh.pg.sentences([
                    // t_tsc_to_fountain_pen.Error($)
                ])
            )
        ]))
        case 'directory content processing': return pt.ss($, ($) => sh.ph.composed([
            sh.ph.literal("directory content processing: "),
            sh.ph.indent(
                sh.pg.sentences(pt.list.from.dictionary(
                    $,
                ).convert(
                    ($, id) => sh.sentence([
                        sh.ph.literal(id),
                        sh.ph.literal(":"),
                        pt.decide.state($, ($) => {
                            switch ($[0]) {
                                case 'not a directory': return pt.ss($, ($) => sh.ph.literal("not a directory"))
                                case 'directory content': return pt.ss($, ($) => t_read_directory_content_to_fountain_pen.Error($))
                                default: return pt.au($[0])
                            }
                        })

                    ])))
            )
        ]))
        case 'read directory': return pt.ss($, ($) => sh.ph.composed([
            t_read_directory_to_fountain_pen.Error($)
        ]))
        default: return pt.au($[0])
    }
})