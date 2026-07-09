import * as p_ from 'pareto-core/implementation/transformer'

import type * as interface_ from "../../../../declarations/transformers/parse/prose.js"

//shorthands
import * as sh from "pareto-fountain-pen/shorthands/prose/deprecated"
    
export const Error: interface_.Error = ($) => p_.from.state($).decide(
    ($) => {
        switch ($[0]) {
            case 'expected one of': return p_.option($, ($) => sh.ph.composed([
                sh.ph.literal("expected one of: "),
                sh.ph.indent(
                    sh.pg.sentences(
                        p_.from.dictionary($).convert_to_list(
                            ($, id) => sh.sentence([
                                sh.ph.literal(id)
                            ])
                        ))
                ),

            ]))
            case 'expected a text': return p_.option($, ($) => sh.ph.composed([
                sh.ph.literal("expected a text: "),
                sh.ph.literal($['description'])
            ]))
            case 'too many arguments': return p_.option($, ($) => sh.ph.literal("too many arguments"))
            default: return p_.exhaustive($[0])
        }
    })