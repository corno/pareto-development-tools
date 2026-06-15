import * as pt from 'pareto-core/dist/implementation/transformer'
import * as p_i from 'pareto-core/dist/interface/transformer'

import * as d_in from "../../../../interface/to_be_generated/create_dependency_graph"
import * as d_out from "pareto-fountain-pen/dist/interface/generated/liana/schemas/prose/data"

export type Error = p_i.Transformer<d_in.Error, d_out.Phrase>

import * as sh from "pareto-fountain-pen/dist/shorthands/prose"

import * as t_get_package_dependencies_to_fountain_pen from "../get_package_dependencies/fountain_pen"

export const Error: Error = ($) => pt.decide.state($, ($) => {
    switch ($[0]) {
        case 'log': return pt.ss($, ($) => sh.ph.composed([
            sh.ph.literal("log: "),
            sh.ph.indent(sh.pg.sentences([
                // t_tsc_to_fountain_pen.Error($)
            ]))
        ]))
        case 'package dependencies': return pt.ss($, ($) => sh.ph.composed([
            sh.ph.literal("package dependencies: "),
            sh.ph.indent(
                sh.pg.sentences([
                    sh.sentence([
                        t_get_package_dependencies_to_fountain_pen.Error($)
                    ])
                ])
            )
        ]))
        default: return pt.au($[0])
    }
})