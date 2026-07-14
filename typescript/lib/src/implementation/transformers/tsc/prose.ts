import * as p_ from 'pareto-core/implementation/serializer'

//schemas
import type * as s_in from "../../../interface/schemas/tsc.js"

namespace declarations {
    export type Error = p_.Paragraph_Serializer_With_Parameter<
        s_in.Error,
        {
            'concise': boolean
        }
    >
}

//dependencies
import * as t_espe_to_prose from "pareto-resources/implementation/serializers/execute_smelly_command_executable"

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