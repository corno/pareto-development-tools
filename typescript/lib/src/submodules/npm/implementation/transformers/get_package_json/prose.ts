import * as p_ from 'pareto-core/implementation/transformer'
import type * as p_i from 'pareto-core/interface/transformer'

//schemas
import type * as s_in from "../../../interface/schemas/get_package_json.js"

import type * as s_out from "../../../interface/schemas/prose.js"
namespace declarations {

    export type Error = p_i.Transformer<
        s_in.Error, s_out.Phrase
    >

}

//shorthands
import * as sh from "pareto-fountain-pen/shorthands/prose/deprecated"

//dependencies
import * as t_read_file_to_prose from "pareto-filesystem-unrestricted-api/implementation/transformers/read_file/prose"
import * as t_deserialize_package_json_to_prose from "../deserialize_package_json/prose.js"

export const Error: declarations.Error = ($) => {
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