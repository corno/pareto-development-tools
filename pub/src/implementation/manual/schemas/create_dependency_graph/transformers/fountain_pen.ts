import * as _p from 'pareto-core/dist/expression'
import * as _pi from 'pareto-core/dist/interface'

import * as d_in from "../../../../../interface/to_be_generated/create_dependency_graph"
import * as d_out from "pareto-fountain-pen/dist/interface/generated/liana/schemas/block/data"

export type Error = _pi.Transformer<d_in.Error, d_out.Phrase>

import * as sh from "pareto-fountain-pen/dist/shorthands/block"

import * as t_get_package_dependencies_to_fountain_pen from "../../get_package_dependencies/transformers/fountain_pen"

export const Error: Error = ($) => _p.decide.state($, ($) => {
    switch ($[0]) {
        case 'log': return _p.ss($, ($) => sh.ph.composed([
            sh.ph.literal("log: "),
            sh.ph.indent(sh.pg.sentences([
                // t_tsc_to_fountain_pen.Error($)
            ]))
        ]))
        case 'package dependencies': return _p.ss($, ($) => sh.ph.composed([
            sh.ph.literal("package dependencies: "),
            sh.ph.indent(
                sh.pg.sentences([
                    t_get_package_dependencies_to_fountain_pen.Error($)
                ])
            )
        ]))
        default: return _p.au($[0])
    }
})