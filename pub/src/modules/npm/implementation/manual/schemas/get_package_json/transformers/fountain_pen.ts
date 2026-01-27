import * as _p from 'pareto-core/dist/transformer'
import * as _pi from 'pareto-core/dist/interface'

import * as d_in from "../../../../../interface/to_be_generated/get_package_json"
import * as d_out from "pareto-fountain-pen/dist/interface/generated/liana/schemas/block/data"

export type Error = _pi.Transformer<d_in.Error, d_out.Block_Part>

import * as sh from "pareto-fountain-pen/dist/shorthands/block"

import * as t_read_file_to_fountain_pen from "pareto-resources/dist/implementation/manual/schemas/read_file/transformers/fountain_pen"

export const Error: Error = ($) => {
    return _p.decide.state($, ($): d_out.Block_Part => {
        switch ($[0]) {
            case 'error while reading package.json': return _p.ss($, ($) => sh.b.sub([
                sh.b.snippet(`error while reading package.json: `),
                sh.b.indent([
                    sh.g.nested_block([
                        t_read_file_to_fountain_pen.Error($)
                    ])
                ]),
            ]))
            case 'error while parsing package.json': return _p.ss($, ($) => sh.b.sub([
                sh.b.snippet(`error while parsing package.json: `),
                sh.b.indent([
                    sh.g.nested_block([
                        //FIXME
                        // sh.b.snippet($)
                    ])
                ]),
            ]))
            default: return _p.au($[0])
        }
    })
}