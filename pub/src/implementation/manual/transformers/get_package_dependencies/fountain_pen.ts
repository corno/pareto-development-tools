import * as _p from 'pareto-core/dist/assign'
import * as _pi from 'pareto-core/dist/interface'

import * as d_in from "../../../../interface/to_be_generated/get_package_dependencies"
import * as d_out from "pareto-fountain-pen/dist/interface/generated/liana/schemas/prose/data"

export type Error = _pi.Transformer<d_in.Error, d_out.Phrase>

//dependencies
import * as t_read_directory_to_fountain_pen from "pareto-resources/dist/implementation/manual/schemas/read_directory/transformers/fountain_pen"
import * as t_deserialize_package_json_to_fountain_pen from "../../../../modules/npm/implementation/manual/transformers/deserialize_package_json/fountain_pen"

import * as sh from "pareto-fountain-pen/dist/shorthands/prose"

export const Error: Error = ($) => _p.decide.state($, ($) => {
    switch ($[0]) {
        case 'directory content processing': return _p.ss($, ($) => sh.ph.composed(_p.list.from.dictionary(
            $,
        ).convert(
            ($, id) => sh.ph.composed([
                sh.ph.literal("package "),
                sh.ph.literal(id),
                sh.ph.literal(": "),
                sh.ph.indent(sh.pg.sentences([
                    sh.sentence([
                        _p.decide.state($, ($) => {
                            switch ($[0]) {
                                case 'not a directory': return _p.ss($, ($) => sh.ph.literal("not a directory"))
                                case 'no package.json file': return _p.ss($, ($) => sh.ph.literal("no package.json file"))
                                case 'parse error': return _p.ss($, ($) => t_deserialize_package_json_to_fountain_pen.Error($))
                                default: return _p.au($[0])
                            }
                        })
                    ])
                ]))
            ])
        )))
        case 'read directory': return _p.ss($, ($) => t_read_directory_to_fountain_pen.Error($))
        default: return _p.au($[0])
    }
})