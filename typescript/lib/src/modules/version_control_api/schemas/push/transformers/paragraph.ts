import * as p_ from 'pareto-core/transformer'

//schemas
import type * as s_in from "../schema.js"
import type * as s_out from "pareto-fountain-pen/modules/paragraph/schemas/paragraph/schema"

namespace declarations {

    export type Error = p_.Transformer<
        s_in.Error,
        s_out.Phrase
    >
}

//shorthands
import * as sh from "pareto-fountain-pen/modules/paragraph/schemas/paragraph/shorthands/deprecated"

//dependencies
import * as t_ece_to_paragraph from "pareto-execute-unrestricted-api/schemas/execute_unrestricted_command_executable/transformers/paragraph"


export const Error: declarations.Error = ($) => p_.from.state($).decide(
    ($) => {
        switch ($[0]) {
            case 'could not push': return p_.option($, ($) => sh.ph.composed([
                sh.ph.text("could not push:"),
                t_ece_to_paragraph.Error($)
            ]))
            default: return p_.exhaustive($[0])
        }
    })