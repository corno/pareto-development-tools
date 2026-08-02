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
        }
    >
}

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
                            : p_.from.list($).map(($) => sh.sentence([
                                sh.ph.text($),
                            ]))
                        )
                        case 'log': return p_.ss($, ($) => p_.literal.list([
                            sh.sentence([
                                sh.ph.text("could not log"),
                            ])
                        ]))
                        case 'directory content processing': return p_.ss($, ($) => p_.literal.list([
                            sh.sentence([
                                sh.ph.text("could not process directory content"),
                            ])
                        ]))
                        default: return p_.au($[0])
                    }
                }
            )
        )
    )
])