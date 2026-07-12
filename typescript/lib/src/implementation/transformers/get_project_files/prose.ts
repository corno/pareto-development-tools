import * as p_ from 'pareto-core/implementation/transformer'

//schemas
import type * as s_in from "../../../interface/schemas/get_project_files.js"
import type * as s_out from "../../../interface/schemas/prose.js"

namespace declarations {
    export type Error = p_.Transformer<
        s_in.Error,
        s_out.Phrase
    >
}

//shorthands
import * as sh from "pareto-fountain-pen/shorthands/prose/deprecated"

//dependencies
import * as t_read_directory_content_to_prose from "pareto-filesystem-unrestricted-api/implementation/transformers/read_directory_content/prose"
import * as t_read_directory_to_prose from "pareto-filesystem-unrestricted-api/implementation/transformers/read_directory/prose"

export const Error: declarations.Error = ($) => p_.from.state($).decide(
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