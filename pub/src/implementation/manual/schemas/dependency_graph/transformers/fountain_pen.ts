import * as _p from 'pareto-core-transformer'
import * as _pi from 'pareto-core-interface'

import * as d_in from "../../../../../interface/to_be_generated/create_dependency_graph"
import * as d_out from "pareto-fountain-pen/dist/interface/generated/pareto/schemas/block/data_types/target"

export type Error = _pi.Transformer<d_in.Error, d_out.Block_Part>

import * as sh from "pareto-fountain-pen/dist/shorthands/block"

import * as t_package_dependencies_to_fountain_pen from "../../package_dependencies/transformers/fountain_pen"

export const Error: Error = ($) => _p.sg($, ($) => {
    switch ($[0]) {
        case 'log': return _p.ss($, ($) => sh.b.sub([
            sh.b.snippet(`log: `),
            sh.b.indent([
                sh.g.nested_block([
                    // t_tsc_to_fountain_pen.Error($)
                ])
            ])
        ]))
        case 'package dependencies': return _p.ss($, ($) => sh.b.sub([
            sh.b.snippet(`package dependencies: `),
            sh.b.indent([
                sh.g.nested_block([
                    t_package_dependencies_to_fountain_pen.Error($)
                ])
            ])
        ]))
        default: return _p.au($[0])
    }
})