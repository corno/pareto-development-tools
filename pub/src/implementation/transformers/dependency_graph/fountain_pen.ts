import * as _ea from 'exupery-core-alg'
import * as _et from 'exupery-core-types'

import * as d_in from "../../../interface/algorithms/commands/dependency_graph"
import * as d_out from "pareto-fountain-pen/dist/interface/generated/pareto/schemas/block/data_types/target"

export type Error = _et.Transformer_New<d_in.Error, d_out.Block_Part>

import * as sh from "pareto-fountain-pen/dist/shorthands/block"

import * as t_package_dependencies_to_fountain_pen from "../package_dependencies/fountain_pen"

export const Error: Error = ($) => _ea.cc($, ($) => {
    switch ($[0]) {
        case 'log': return _ea.ss($, ($) => sh.b.sub([
            sh.b.snippet(`log: `),
            sh.b.indent([
                sh.g.nested_block([
                    // t_tsc_to_fountain_pen.Error($)
                ])
            ])
        ]))
        case 'package dependencies': return _ea.ss($, ($) => sh.b.sub([
            sh.b.snippet(`package dependencies: `),
            sh.b.indent([
                sh.g.nested_block([
                    t_package_dependencies_to_fountain_pen.Error($)
                ])
            ])
        ]))
        default: return _ea.au($[0])
    }
})