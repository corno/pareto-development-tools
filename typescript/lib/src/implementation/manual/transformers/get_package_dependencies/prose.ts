import * as p_ from 'pareto-core/dist/implementation/transformer'
import * as p_i from 'pareto-core/dist/interface/transformer'

import * as d_in from "../../../../interface/data/get_package_dependencies"
import * as d_out from "pareto-fountain-pen/dist/interface/generated/liana/schemas/prose/data"

export type Error = p_i.Transformer<
    d_in.Error,
    d_out.Phrase
>

//dependencies
import * as t_read_directory_to_prose from "pareto-resources/dist/implementation/manual/transformers/read_directory/prose"
import * as t_deserialize_package_json_to_prose from "../../../../modules/npm/implementation/manual/transformers/deserialize_package_json/prose"

import * as sh from "pareto-fountain-pen/dist/shorthands/prose/deprecated"

export const Error: Error = ($) => p_.from.state($).decide(
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
                                                default: return p_.au($[0])
                                            }
                                        })
                                ])
                            ]))
                    ])
                )))
            case 'read directory': return p_.option($, ($) => t_read_directory_to_prose.Error($))
            default: return p_.au($[0])
        }
    })