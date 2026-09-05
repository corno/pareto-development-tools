import * as p_ from 'pareto-core/transformer'

//schemas
import type * as s_in from "../schema.js"
import type * as s_out from "pareto-fountain-pen/modules/paragraph/schemas/paragraph/schema"


namespace declarations {
    export type Error = p_.Transformer_With_Parameter<
        s_in.Error,
        s_out.Phrase,
        {
            'concise': boolean
            'context pathx': string
        }
    >
}

//dependencies
import * as t_pareto_language_from_typescript_directory_to_paragraph from "../../../modules/pareto_language/schemas/pareto_language_from_typescript_directory/transformers/paragraph.js"

//shorthands
import * as sh from "pareto-fountain-pen/modules/paragraph/schemas/paragraph/shorthands/deprecated"

export const Error: declarations.Error = ($, $p) => sh.ph.composed([
    sh.ph.text("file structure problems"),
    sh.ph.indent(
        p_.from.state($).decide(
            ($): s_out.Paragraph => {
                switch ($[0]) {
                    case 'file structure problems': return p_.option($, ($) => $p.concise
                        ? sh.pg.sentences([])
                        : sh.pg.sentences(p_.from.dictionary($).convert_to_list(($, id) => sh.sentence([
                            sh.ph.text($p['context pathx']),
                            sh.ph.text(id),
                            sh.ph.indent(
                                sh.pg.sentences(
                                    p_.from.list($).map(($) => sh.sentence([
                                        sh.ph.text($),
                                    ]))
                                )
                            ),
                        ])))
                    )
                    case 'directory content processing': return p_.option($, ($) => sh.pg.sentences([
                        sh.sentence([
                            sh.ph.text("could not process directory content"),
                        ])
                    ]))
                    case 'node analysis': return p_.option($, ($) => sh.pg.sentences([
                        sh.sentence([
                            sh.ph.text("could not analyze 1 or more nodes"),
                        ])
                    ]))
                    case 'typescript parsing': return p_.option($, ($) => sh.pg.sentences([
                        sh.sentence([
                            sh.ph.text("FIXME TYPESCRIPT PARSING ERROR"),
                        ])
                    ]))
                    case 'pareto parsing': return p_.option($, ($) => sh.pg.sentences(
                        t_pareto_language_from_typescript_directory_to_paragraph.Error(
                            $.error,
                            {
                                'context path': $['context path'],
                            }
                        )
                    ))
                    case 'log': return p_.option($, ($) => sh.pg.sentences([
                        sh.sentence([
                            sh.ph.text("log error"),
                        ])
                    ]))
                    default: return p_.exhaustive($[0])
                }
            }
        )
    )
])