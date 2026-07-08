import * as p_ from 'pareto-core/implementation/transformer'
import type * as p_i from 'pareto-core/interface/transformer'

//data types
import type * as d_in from "../../../../interface/data/parse.js"
import type * as d_out from "pareto-fountain-pen/interface/generated/liana/schemas/prose/data"



export namespace interface_ {
    export type Error = p_i.Transformer<
        d_in.Error,
        d_out.Phrase
    >
}

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