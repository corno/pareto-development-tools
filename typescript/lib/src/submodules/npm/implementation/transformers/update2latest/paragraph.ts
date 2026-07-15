import * as p_ from 'pareto-core/implementation/transformer'

//schemas
import type * as s_in from "../../../interface/schemas/update2latest.js"
import type * as s_out from "../../../interface/schemas/paragraph.js"

namespace declarations {

    export type Error = p_.Transformer<
        s_in.Error,
        s_out.Phrase
    >

}

//shorthands
import * as sh from "pareto-fountain-pen/shorthands/paragraph/deprecated"

//dependencies
import * as t_epe_to_prose from "pareto-resources/implementation/transformers/execute_unrestricted_command_executable/paragraph"

export const Error: declarations.Error = ($) => p_.from.state($).decide(
    ($) => {
        switch ($[0]) {
            case 'error while running update2latest': return p_.option($, ($) => sh.ph.composed([
                sh.ph.text("error while running update2latest: "),
                t_epe_to_prose.Error($)
            ]))
            default: return p_.exhaustive($[0])
        }
    })