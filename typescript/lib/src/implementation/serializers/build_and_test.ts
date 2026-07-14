import * as p_ from 'pareto-core/implementation/serializer'

//schemas
import type * as s_in from "../../interface/schemas/build_and_test.js"

namespace declarations {
    export type Error = p_.Phrase_Serializer_With_Parameter<
        s_in.Error,
        {
        'concise': boolean
    }
    >
}

//shorthands
import * as sh from "pareto-fountain-pen/shorthands/prose/deprecated"

//dependencies
import * as t_build_to_prose from "./build.js"
import * as t_epe_to_prose from "pareto-resources/implementation/serializers/execute_command_executable"

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