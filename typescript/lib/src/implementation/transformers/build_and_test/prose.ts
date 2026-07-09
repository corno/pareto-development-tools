import * as p_ from 'pareto-core/implementation/transformer'

import type * as interface_ from "../../../declarations/transformers/build_and_test/prose.js"

//shorthands
import * as sh from "pareto-fountain-pen/shorthands/prose/deprecated"

//dependencies
import * as t_build_to_prose from "../build/prose.js"
import * as t_epe_to_prose from "pareto-resources/implementation/manual/transformers/execute_command_executable/prose"

export const Error: interface_.Error = ($, $p) => p_.from.state($).decide(
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