import * as p_ from 'pareto-core/implementation/transformer'
import type * as p_i from 'pareto-core/interface/transformer'

//data types
import type * as d_in from "../../../interface/data/get_package_json.js"
import type * as d_out from "pareto-fountain-pen/interface/generated/liana/schemas/prose/data"

export namespace interface_ {

    export type Error = p_i.Transformer<
        d_in.Error, d_out.Phrase
    >

}

//shorthands
import * as sh from "pareto-fountain-pen/shorthands/prose/deprecated"

//dependencies
import * as t_read_file_to_prose from "pareto-filesystem-unrestricted-api/implementation/manual/transformers/read_file/prose"
import * as t_deserialize_package_json_to_prose from "../deserialize_package_json/prose.js"

export const Error: interface_.Error = ($) => {
    return p_.from.state($).decide(
        ($) => {
            switch ($[0]) {
                case 'error while reading package.json': return p_.option($, ($) => sh.ph.composed([
                    sh.ph.literal("error while reading package.json: "),
                    sh.ph.indent(
                        sh.pg.sentences([
                            sh.sentence([
                                t_read_file_to_prose.Error($)
                            ])
                        ])),
                ]))
                case 'error while parsing package.json': return p_.option($, ($) => sh.ph.composed([
                    sh.ph.literal("error while parsing package.json: "),
                    sh.ph.indent(
                        sh.pg.sentences([
                            sh.sentence([
                                t_deserialize_package_json_to_prose.Error($)
                            ])
                        ])),
                ]))
                default: return p_.exhaustive($[0])
            }
        }
    )
}