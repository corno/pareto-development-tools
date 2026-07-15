import * as p_ from 'pareto-core/implementation/serializer'

//schemas
import type * as s_in from "../../interface/schemas/get_project_files.js"

namespace declarations {
    export type Error = p_.Phrase_Serializer<
        s_in.Error
    >
}

//shorthands
import * as sh from "pareto-fountain-pen/shorthands/prose_extended/deprecated"

//dependencies
import * as t_read_directory_content_to_prose from "pareto-filesystem-unrestricted-api/implementation/serializers/read_directory_content"
import * as t_read_directory_to_prose from "pareto-filesystem-unrestricted-api/implementation/serializers/read_directory"

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