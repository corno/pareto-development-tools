import * as p_ from 'pareto-core/implementation/transformer'

//schemas
import type * as s_in from "../../../schemas/get_package_dependencies.js"
import type * as s_out from "../../../schemas/paragraph.js"

namespace declarations {
    export type Error = p_.Transformer<
        s_in.Error,
        s_out.Phrase
    >
}

//dependencies
import * as ser_read_directory from "pareto-filesystem-unrestricted-api/modules/unrestricted/implementation/serializers/read_directory"
import * as ser_deserialize_package_json from "../../../../../submodules/npm/implementation/transformers/deserialize_package_json/paragraph.js"

//shorthands
import * as sh from "pareto-fountain-pen/modules/paragraph/schemas/paragraph/shorthands/deprecated"

export const Error: declarations.Error = ($) => p_.from.state($).decide(
    ($) => {
        switch ($[0]) {
            case 'directory content processing': return p_.option($, ($) => sh.ph.composed(
                p_.from.dictionary($).convert_to_list(
                    ($, id) => sh.ph.composed([
                        sh.ph.text("package "),
                        sh.ph.text(id),
                        sh.ph.text(": "),
                        sh.ph.indent(
                            sh.pg.sentences([
                                sh.sentence([
                                    p_.from.state($).decide(
                                        ($) => {
                                            switch ($[0]) {
                                                case 'not a directory': return p_.option($, ($) => sh.ph.text("not a directory"))
                                                case 'no package.json file': return p_.option($, ($) => sh.ph.text("no package.json file"))
                                                case 'parse error': return p_.option($, ($) => ser_deserialize_package_json.Error($))
                                                default: return p_.exhaustive($[0])
                                            }
                                        })
                                ])
                            ]))
                    ])
                )))
            case 'read directory': return p_.option($, ($) => sh.ph.text(ser_read_directory.Error($)))
            default: return p_.exhaustive($[0])
        }
    })