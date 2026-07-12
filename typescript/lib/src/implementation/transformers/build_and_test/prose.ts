import * as p_ from 'pareto-core/implementation/transformer'

//schemas
import type * as s_in from "../../../interface/schemas/build_and_test.js"
import type * as s_out from "../../../interface/schemas/prose.js"

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
import * as sh from "pareto-fountain-pen/shorthands/prose/deprecated"

//dependencies
import * as t_build_to_prose from "../build/prose.js"
import * as t_epe_to_prose from "pareto-resources/implementation/transformers/execute_command_executable/prose"

export const Error: declarations.Error = ($, $p) => p_.from.state($).decide(
    ($) => {
        switch ($[0]) {
            case 'error building': return p_.option($, ($) => t_build_to_prose.Error($, $p))
            case 'error testing': return p_.option($, ($) => sh.ph.composed([
                sh.ph.literal("error while testing:"),
                t_epe_to_prose.Error($),
            ]))
            default: return p_.exhaustive($[0])
        }
    })