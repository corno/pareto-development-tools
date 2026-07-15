import * as p_ from 'pareto-core/implementation/serializer'

//schemas
import type * as s_in from "../../interface/schemas/get_package_json.js"


namespace declarations {

    export type Error = p_.Phrase_Serializer<
        s_in.Error
    >

}

//shorthands
import * as sh from "pareto-fountain-pen/shorthands/prose_extended/deprecated"

//dependencies
import * as t_read_file_to_prose from "pareto-filesystem-unrestricted-api/implementation/serializers/read_file"
import * as t_deserialize_package_json_to_prose from "./deserialize_package_json.js"

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