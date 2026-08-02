import * as p_ from 'pareto-core/implementation/transformer'

//schemas
import type * as s_in from "../schema.js"
import type * as s_out from "pareto-fountain-pen/modules/paragraph/schemas/paragraph/schema"


namespace declarations {

    export type Error = p_.Transformer<
        s_in.Error,
        s_out.Phrase
    >

}

//shorthands
import * as sh from "pareto-fountain-pen/modules/paragraph/schemas/paragraph/shorthands/deprecated"

//dependencies
import * as ser_read_file from "pareto-filesystem-unrestricted-api/modules/unrestricted/schemas/read_file/serializers"
import * as t_deserialize_package_json_to_prose from "../../deserialize_package_json/transformers/paragraph.js"

export const Error: declarations.Error = ($) => {
    return p_.from.state($).decide(
        ($) => {
            switch ($[0]) {
                case 'error while reading package.json': return p_.option($, ($) => sh.ph.composed([
                    sh.ph.text("error while reading package.json: "),
                    sh.ph.indent(
                        sh.pg.sentences([
                            sh.sentence([
                                sh.ph.text(ser_read_file.Error($))
                            ])
                        ])),
                ]))
                case 'error while parsing package.json': return p_.option($, ($) => sh.ph.composed([
                    sh.ph.text("error while parsing package.json: "),
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