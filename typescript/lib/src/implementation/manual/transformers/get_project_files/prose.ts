import * as p_ from 'pareto-core/implementation/transformer'
import * as p_i from 'pareto-core/interface/transformer'

import * as d_in from "../../../../interface/data/get_project_files.js"
import * as d_out from "pareto-fountain-pen/interface/generated/liana/schemas/prose/data"

export type Error = p_i.Transformer<
    d_in.Error,
    d_out.Phrase
>

import * as sh from "pareto-fountain-pen/shorthands/prose/deprecated"

import * as t_read_directory_content_to_prose from "pareto-filesystem-unrestricted-api/implementation/manual/transformers/read_directory_content/prose"
import * as t_read_directory_to_prose from "pareto-filesystem-unrestricted-api/implementation/manual/transformers/read_directory/prose"

export const Error: Error = ($) => p_.from.state($).decide(
    ($) => {
        switch ($[0]) {
            case 'log': return p_.option($, ($) => sh.ph.composed([
                sh.ph.literal("log: "),
                sh.ph.indent(
                    sh.pg.sentences([
                        // t_tsc_to_prose.Error($)
                    ])
                )
            ]))
            case 'directory content processing': return p_.option($, ($) => sh.ph.composed([
                sh.ph.literal("directory content processing: "),
                sh.ph.indent(
                    sh.pg.sentences(
                        p_.from.dictionary($).convert_to_list(
                            ($, id) => sh.sentence([
                                sh.ph.literal(id),
                                sh.ph.literal(":"),
                                p_.from.state($).decide(
                                    ($) => {
                                        switch ($[0]) {
                                            case 'not a directory': return p_.option($, ($) => sh.ph.literal("not a directory"))
                                            case 'directory content': return p_.option($, ($) => t_read_directory_content_to_prose.Error($))
                                            default: return p_.exhaustive($[0])
                                        }
                                    })

                            ])))
                )
            ]))
            case 'read directory': return p_.option($, ($) => sh.ph.composed([
                t_read_directory_to_prose.Error($)
            ]))
            default: return p_.exhaustive($[0])
        }
    })