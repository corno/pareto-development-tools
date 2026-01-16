import * as _p from 'pareto-core-transformer'
import * as _pi from 'pareto-core-interface'

import * as d_in from "../../../../../interface/to_be_generated/parse"
import * as d_out from "pareto-fountain-pen/dist/interface/generated/pareto/schemas/block/data"

export type Error = _pi.Transformer<d_in.Error, d_out.Block_Part>

import * as sh from "pareto-fountain-pen/dist/shorthands/block"

export const Error: Error = ($) => _p.sg($, ($) => {
    switch ($[0]) {
        case 'expected one of': return _p.ss($, ($) => sh.b.sub([
            sh.b.snippet(`expected one of: `),
            sh.b.indent([
                sh.g.sub(
                    _p.list.from_dictionary($, ($, key) => sh.g.nested_block([
                        sh.b.snippet(key)
                    ]))
                )
            ]),

        ]))
        case 'expected a text': return _p.ss($, ($) => sh.b.sub([
            sh.b.snippet(`expected a text: `),
            sh.b.snippet($['description'])
        ]))
        case 'too many arguments': return _p.ss($, ($) => sh.b.snippet(`too many arguments`))
        default: return _p.au($[0])
    }
})