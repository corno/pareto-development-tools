import * as p_ from 'pareto-core/implementation/serializer'

//schemas
import type * as s_in from "../../interface/schemas/get_package_dependencies.js"

namespace declarations {
    export type Error = p_.Phrase_Serializer<
        s_in.Error
    >
}

//dependencies
import * as ser_read_directory from "pareto-filesystem-unrestricted-api/implementation/serializers/read_directory"
import * as ser_deserialize_package_json from "../../submodules/npm/implementation/serializers/deserialize_package_json.js"

//shorthands
import * as sh from "pareto-fountain-pen/shorthands/prose/deprecated"

export const Error: declarations.Error = ($) => p_.from.state($).decide(
    ($) => {
        switch ($[0]) {
            case 'directory content processing': return p_.option($, ($) => sh.ph.composed(
                p_.from.dictionary($).convert_to_list(
                    ($, id) => sh.ph.composed([
                        sh.ph.literal("package "),
                        sh.ph.literal(id),
                        sh.ph.literal(": "),
                        sh.ph.indent(
                            sh.pg.sentences([
                                sh.sentence([
                                    p_.from.state($).decide(
                                        ($) => {
                                            switch ($[0]) {
                                                case 'not a directory': return p_.option($, ($) => sh.ph.literal("not a directory"))
                                                case 'no package.json file': return p_.option($, ($) => sh.ph.literal("no package.json file"))
                                                case 'parse error': return p_.option($, ($) => ser_deserialize_package_json.Error($))
                                                default: return p_.exhaustive($[0])
                                            }
                                        })
                                ])
                            ]))
                    ])
                )))
            case 'read directory': return p_.option($, ($) => ser_read_directory.Error($))
            default: return p_.exhaustive($[0])
        }
    })