import * as p_ from 'pareto-core/implementation/transformer'

import type * as interface_ from "../../../declarations/transformers/get_package_dependencies/prose.js"

//dependencies
import * as t_read_directory_to_prose from "pareto-filesystem-unrestricted-api/implementation/manual/transformers/read_directory/prose"
import * as t_deserialize_package_json_to_prose from "../../../modules/npm/implementation/manual/transformers/deserialize_package_json/prose.js"

//shorthands
import * as sh from "pareto-fountain-pen/shorthands/prose/deprecated"

export const Error: interface_.Error = ($) => p_.from.state($).decide(
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
                                                case 'parse error': return p_.option($, ($) => t_deserialize_package_json_to_prose.Error($))
                                                default: return p_.exhaustive($[0])
                                            }
                                        })
                                ])
                            ]))
                    ])
                )))
            case 'read directory': return p_.option($, ($) => t_read_directory_to_prose.Error($))
            default: return p_.exhaustive($[0])
        }
    })