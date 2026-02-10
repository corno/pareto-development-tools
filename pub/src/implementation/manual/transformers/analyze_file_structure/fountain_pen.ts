import * as _p from 'pareto-core/dist/assign'
import * as _pi from 'pareto-core/dist/interface'

import * as d_in from "../../../../interface/to_be_generated/analyze_file_structure"
import * as d_out from "pareto-fountain-pen/dist/interface/generated/liana/schemas/prose/data"

export type Error = _pi.Transformer<d_in.Error, d_out.Phrase>

import * as sh from "pareto-fountain-pen/dist/shorthands/prose"

import * as t_read_directory_content_to_fountain_pen from "pareto-resources/dist/implementation/manual/schemas/read_directory_content/transformers/fountain_pen"
import * as t_read_directory_to_fountain_pen from "pareto-resources/dist/implementation/manual/schemas/read_directory/transformers/fountain_pen"

export const Error: Error = ($) => _p.decide.state($, ($) => {
    switch ($[0]) {
        case 'log': return _p.ss($, ($) => sh.ph.composed([
            sh.ph.literal("log: "),
            sh.ph.indent(
                sh.pg.sentences([
                    // t_tsc_to_fountain_pen.Error($)
                ])
            )
        ]))
        case 'directory content processing': return _p.ss($, ($) => sh.ph.composed([
            sh.ph.literal("directory content processing: "),
            sh.ph.indent(
                sh.pg.sentences(_p.list.from.dictionary(
                    $,
                ).convert(
                    ($, id) => sh.sentence([
                        sh.ph.literal(id),
                        sh.ph.literal(":"),
                        _p.decide.state($, ($) => {
                            switch ($[0]) {
                                case 'not a directory': return _p.ss($, ($) => sh.ph.literal("not a directory"))
                                case 'directory content': return _p.ss($, ($) => t_read_directory_content_to_fountain_pen.Error($))
                                default: return _p.au($[0])
                            }
                        })

                    ])))
            )
        ]))
        case 'read directory': return _p.ss($, ($) => sh.ph.composed([
            t_read_directory_to_fountain_pen.Error($)
        ]))
        default: return _p.au($[0])
    }
})