import * as p_ from 'pareto-core/implementation/transformer'

//schemas
import type * as s_in from "../../../interface/schemas/build_and_validate.js"
import type * as s_out from "../../../interface/schemas/paragraph.js"

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
import * as sh from "pareto-fountain-pen/modules/paragraph/shorthands/deprecated"

//dependencies
import * as t_build_to_prose from "../build/paragraph.js"
import * as t_ece_to_paragraph from "pareto-resources/implementation/transformers/execute_unrestricted_command_executable/paragraph"

export const Error: declarations.Error = ($, $p) => p_.from.state($).decide(
    ($) => {
        switch ($[0]) {
            case 'error building': return p_.option($, ($) => t_build_to_prose.Error($, $p))
            case 'error testing': return p_.option($, ($) => sh.ph.composed([
                sh.ph.text("error while testing:"),
                t_ece_to_paragraph.Error($),
            ]))
            default: return p_.exhaustive($[0])
        }
    })