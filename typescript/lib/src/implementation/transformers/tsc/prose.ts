import * as p_ from 'pareto-core/implementation/transformer'

//schemas
import type * as s_in from "../../../interface/schemas/tsc.js"
import type * as s_out from "../../../interface/schemas/prose.js"

namespace declarations {
    export type Error = p_.Transformer_With_Parameter<
        s_in.Error,
        s_out.Paragraph,
        {
        'concise': boolean
    }
    >
}

//dependencies
import * as t_espe_to_prose from "pareto-resources/implementation/transformers/execute_smelly_command_executable/prose"

//shorthands
import * as sh from "pareto-fountain-pen/shorthands/prose/deprecated"

export const Error: declarations.Error = ($, $p) => p_.from.state($).decide(
    ($) => {
        switch ($[0]) {
            case 'error while running tsc': return p_.option($, ($) => $p.concise
                ? sh.pg.sentences([])
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