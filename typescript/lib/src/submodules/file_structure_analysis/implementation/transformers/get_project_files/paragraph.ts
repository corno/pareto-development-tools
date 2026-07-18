import * as p_ from 'pareto-core/implementation/transformer'

//schemas
import type * as s_in from "../../../schemas/get_project_files.js"
import type * as s_out from "../../../schemas/paragraph.js"

namespace declarations {
    export type Error = p_.Transformer<
        s_in.Error,
        s_out.Phrase
    >
}

//shorthands
import * as sh from "pareto-fountain-pen/shorthands/paragraph/deprecated"

//dependencies
import * as t_read_directory_content_to_paragraph from "pareto-filesystem-unrestricted-api/modules/helpers/implementation/transformers/read_directory_content/paragraph"
import * as ser_read_directory from "pareto-filesystem-unrestricted-api/modules/unrestricted/implementation/serializers/read_directory"

export const Error: declarations.Error = ($) => p_.from.state($).decide(
    ($) => {
        switch ($[0]) {
            case 'log': return p_.option($, ($) => sh.ph.composed([
                sh.ph.text("log: "),
                sh.ph.indent(
                    sh.pg.sentences([
                        // t_tsc_to_prose.Error($)
                    ])
                )
            ]))
            case 'directory content processing': return p_.option($, ($) => sh.ph.composed([
                sh.ph.text("directory content processing: "),
                sh.ph.indent(
                    sh.pg.sentences(
                        p_.from.dictionary($).convert_to_list(
                            ($, id) => sh.sentence([
                                sh.ph.text(id),
                                sh.ph.text(":"),
                                p_.from.state($).decide(
                                    ($) => {
                                        switch ($[0]) {
                                            case 'not a directory': return p_.option($, ($) => sh.ph.text("not a directory"))
                                            case 'directory content': return p_.option($, ($) => t_read_directory_content_to_paragraph.Error($))
                                            default: return p_.exhaustive($[0])
                                        }
                                    })

                            ])))
                )
            ]))
            case 'read directory': return p_.option($, ($) => sh.ph.text(ser_read_directory.Error($)))
            default: return p_.exhaustive($[0])
        }
    })