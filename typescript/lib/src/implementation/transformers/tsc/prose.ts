import * as p_ from 'pareto-core/implementation/transformer'

import type * as interface_ from "../../../declarations/transformers/tsc/prose.js"

//dependencies
import * as t_espe_to_prose from "pareto-resources/implementation/transformers/execute_smelly_command_executable/prose"

//shorthands
import * as sh from "pareto-fountain-pen/shorthands/prose/deprecated"

export const Error: interface_.Error = ($, $p) => p_.from.state($).decide(
    ($) => {
        switch ($[0]) {
            case 'error while running tsc': return p_.option($, ($) => $p.concise
                ? sh.pg.deprecated_composed([])
                : sh.pg.sentences([
                    sh.sentence([
                        sh.ph.literal("error while running tsc: "),
                    ]),
                    sh.sentence([
                        t_espe_to_prose.Error($),
                    ]),
                    //
                ])
            )
            default: return p_.exhaustive($[0])
        }
    })