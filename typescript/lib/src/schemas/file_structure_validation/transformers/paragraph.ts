import * as p_ from 'pareto-core/implementation/transformer'

//schemas
import type * as s_in from "../schema.js"
import type * as s_out from "pareto-fountain-pen/modules/paragraph/schemas/paragraph/schema"


namespace declarations {
    export type Error = p_.Transformer_With_Parameter<
        s_in.Error,
        s_out.Phrase,
        {
            'concise': boolean
            'context path': string
        }
    >
}

//dependencies

import * as ser_path from "pareto-filesystem-unrestricted-api/modules/unrestricted/schemas/path/serializers"

//shorthands
import * as sh from "pareto-fountain-pen/modules/paragraph/schemas/paragraph/shorthands/deprecated"

export const Error: declarations.Error = ($, $p) => sh.ph.composed([
    sh.ph.text("file structure problems"),
    sh.ph.indent(
        sh.pg.sentences(
            p_.from.state($).decide(
                ($) => {
                    switch ($[0]) {
                        case 'file structure problems': return p_.ss($, ($) => $p.concise
                            ? p_.literal.list([])
                            : p_.from.dictionary($).convert_to_list(($, id) => sh.sentence([
                                sh.ph.text($p['context path']),
                                sh.ph.text(id),
                                sh.ph.indent(
                                    sh.pg.sentences(
                                        p_.from.list($).map(($) => sh.sentence([
                                            sh.ph.text($),
                                        ]))
                                    )
                                ),
                            ]))
                        )
                        case 'directory content processing': return p_.ss($, ($) => p_.literal.list([
                            sh.sentence([
                                sh.ph.text("could not process directory content"),
                            ])
                        ]))
                        case 'node analysis': return p_.ss($, ($) => p_.literal.list([
                            sh.sentence([
                                sh.ph.text("could not analyze 1 or more nodes"),
                            ])
                        ]))
                        case 'typescript parsing': return p_.ss($, ($) => p_.literal.list([
                            sh.sentence([
                                sh.ph.text("FIXME TYPESCRIPT PARSING ERROR"),
                            ])
                        ]))
                        case 'pareto parsing': return p_.ss($, ($) => p_.literal.list([
                            sh.sentence([
                                p_.from.state($).decide(
                                    ($) => {
                                        switch ($[0]) {
                                            case 'no such node': return p_.ss($, ($) => sh.ph.text("no such node: " + $.name + " in " + ser_path.Context_Path($['context path']) + $['internal path']))
                                            case 'not a directory': return p_.ss($, ($) => sh.ph.text("not a directory: " + $.name + " in " + ser_path.Context_Path($['context path']) + $['internal path']))
                                            case 'not a file': return p_.ss($, ($) => sh.ph.text("not a file: " + $.name + " in " + ser_path.Context_Path($['context path']) + $['internal path']))
                                            default: return p_.au($[0])
                                        }
                                    }
                                )
                            ])
                        ]))
                        case 'log': return p_.ss($, ($) => p_.literal.list([
                            sh.sentence([
                                sh.ph.text("log error"),
                            ])
                        ]))
                        default: return p_.au($[0])
                    }
                }
            )
        )
    )
])