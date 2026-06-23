import * as p_ from 'pareto-core/dist/implementation/transformer'
import * as p_i from 'pareto-core/dist/interface/transformer'

import * as d_in from "../../../../interface/data/get_package_json"
import * as d_out from "pareto-fountain-pen/dist/interface/generated/liana/schemas/prose/data"

export type Error = p_i.Transformer<
d_in.Error, d_out.Phrase
>

import * as sh from "pareto-fountain-pen/dist/shorthands/prose"

import * as t_read_file_to_fountain_pen from "pareto-resources/dist/implementation/manual/transformers/read_file/fountain_pen"
import * as t_deserialize_package_json_to_fountain_pen from "../deserialize_package_json/fountain_pen"

export const Error: Error = ($) => {
    return p_.from.state($).decide(
        ($): d_out.Phrase => {
            switch ($[0]) {
                case 'error while reading package.json': return p_.ss($, ($) => sh.ph.composed([
                    sh.ph.literal("error while reading package.json: "),
                    sh.ph.indent(sh.pg.sentences([
                        sh.sentence([
                            t_read_file_to_fountain_pen.Error($)
                        ])
                    ])),
                ]))
                case 'error while parsing package.json': return p_.ss($, ($) => sh.ph.composed([
                    sh.ph.literal("error while parsing package.json: "),
                    sh.ph.indent(sh.pg.sentences([
                        sh.sentence([
                            t_deserialize_package_json_to_fountain_pen.Error($)
                        ])
                    ])),
                ]))
                default: return p_.au($[0])
            }
        })
}