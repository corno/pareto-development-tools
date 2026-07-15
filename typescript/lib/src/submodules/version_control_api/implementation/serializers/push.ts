import * as p_ from 'pareto-core/implementation/serializer'

//schemas
import type * as s_in from "../../interface/schemas/push.js"

namespace declarations {

    export type Error = p_.Phrase_Serializer<
        s_in.Error
    >
}

//shorthands
import * as sh from "pareto-fountain-pen/shorthands/prose_simple/deprecated"

//dependencies
import * as t_epe_to_prose from "pareto-resources/implementation/serializers/execute_command_executable"


export const Error: declarations.Error = ($) => p_.from.state($).decide(
    ($) => {
        switch ($[0]) {
            case 'could not push': return p_.option($, ($) => sh.ph.composed([
                sh.ph.literal("could not push:"),
                t_epe_to_prose.Error($)
            ]))
            default: return p_.exhaustive($[0])
        }
    })