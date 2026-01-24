import * as _p from 'pareto-core/dist/transformer'
import * as _pi from 'pareto-core/dist/interface'

import * as d_in from "../../../../../interface/to_be_generated/analyze_file_structure"
import * as d_out from "pareto-fountain-pen/dist/interface/generated/liana/schemas/block/data"

export type Error = _pi.Transformer<d_in.Error, d_out.Block_Part>

import * as sh from "pareto-fountain-pen/dist/shorthands/block"

import * as t_read_directory_content_to_fountain_pen from "pareto-resources/dist/implementation/manual/schemas/read_directory_content/transformers/fountain_pen"
import * as t_read_directory_to_fountain_pen from "pareto-resources/dist/implementation/manual/schemas/read_directory/transformers/fountain_pen"

export const Error: Error = ($) => _p.decide.state($, ($) => {
    switch ($[0]) {
        case 'log': return _p.ss($, ($) => sh.b.sub([
            sh.b.snippet(`log: `),
            sh.b.indent([
                sh.g.nested_block([
                    // t_tsc_to_fountain_pen.Error($)
                ])
            ])
        ]))
        case 'directory content processing': return _p.ss($, ($) => sh.b.sub([
            sh.b.snippet(`directory content processing: `),
            sh.b.indent([
                sh.g.sub(_p.list.from_dictionary($, ($, key) => sh.g.nested_block([
                    sh.b.snippet(`${key}: `),
                    _p.decide.state($, ($) => {
                        switch ($[0]) {
                            case 'not a directory': return _p.ss($, ($) =>sh.b.snippet(`not a directory`))
                            case 'directory content': return _p.ss($, ($) => t_read_directory_content_to_fountain_pen.Error($))
                            default: return _p.au($[0])
                        }
                    })

                ])))
            ])
        ]))
        case 'read directory': return _p.ss($, ($) => sh.b.sub([
            t_read_directory_to_fountain_pen.Error($)
        ]))
        default: return _p.au($[0])
    }
})