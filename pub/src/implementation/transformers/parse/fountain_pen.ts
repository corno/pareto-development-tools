import * as _ea from 'exupery-core-alg'
import * as _et from 'exupery-core-types'

import * as d_in from "../../../interface/algorithms/commands/parse"
import * as d_out from "pareto-fountain-pen/dist/interface/generated/pareto/schemas/block/data_types/target"

export type Error = _et.Transformer<d_in.Error, d_out.Block_Part>

import * as sh from "pareto-fountain-pen/dist/shorthands/block"

export const Error: Error = ($) => _ea.cc($, ($) => {
    switch ($[0]) {
        case 'expected one of': return _ea.ss($, ($) => sh.b.sub([
            sh.b.snippet(`expected one of: `),
            sh.b.indent([
                sh.g.sub(
                    $.deprecated_to_array(() => 1).map(($) => sh.g.nested_block([
                        sh.b.snippet($.key)
                    ]))
                )
            ]),

        ]))
        case 'expected a text': return _ea.ss($, ($) => sh.b.sub([
            sh.b.snippet(`expected a text: `),
            sh.b.snippet($['description'])
        ]))
        default: return _ea.au($[0])
    }
})