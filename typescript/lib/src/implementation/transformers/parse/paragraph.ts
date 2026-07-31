import * as p_ from 'pareto-core/implementation/transformer'

//schemas
import type * as s_in from "../../../schemas/parse.js"
import type * as s_out from "pareto-fountain-pen/modules/paragraph/schemas/paragraph/schema"

namespace declarations {
    export type Error = p_.Transformer<
        s_in.Error,
        s_out.Phrase
    >
}

//shorthands
import * as sh from "pareto-fountain-pen/modules/paragraph/schemas/paragraph/shorthands/deprecated"
    
export const Error: declarations.Error = ($) => p_.from.state($).decide(
    ($) => {
        switch ($[0]) {
            case 'expected one of': return p_.option($, ($) => sh.ph.composed([
                sh.ph.text("expected one of: "),
                sh.ph.indent(
                    sh.pg.sentences(
                        p_.from.dictionary($).convert_to_list(
                            ($, id) => sh.sentence([
                                sh.ph.text(id)
                            ])
                        ))
                ),

            ]))
            case 'expected a text': return p_.option($, ($) => sh.ph.composed([
                sh.ph.text("expected a text: "),
                sh.ph.text($['description'])
            ]))
            case 'too many arguments': return p_.option($, ($) => sh.ph.text("too many arguments"))
            default: return p_.exhaustive($[0])
        }
    })