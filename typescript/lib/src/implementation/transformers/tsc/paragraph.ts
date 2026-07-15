import * as p_ from 'pareto-core/implementation/transformer'

//schemas
import type * as s_in from "../../../interface/schemas/tsc.js"
import type * as s_out from "../../../interface/schemas/paragraph.js"

namespace declarations {
    export type Error = p_.Transformer_With_Parameter<
        s_in.Error,
        s_out.Paragraph, //this is a paragraph because it is optional, if it would be a phrase, there would always be a line (but empty if concise)
        {
            'concise': boolean
        }
    >
}

//dependencies
import * as t_espe_to_paragraph from "pareto-resources/implementation/transformers/execute_unrestricted_smelly_command_executable/paragraph"

//shorthands
import * as sh from "pareto-fountain-pen/shorthands/paragraph/deprecated"

export const Error: declarations.Error = ($, $p) => p_.from.state($).decide(
    ($) => {
        switch ($[0]) {
            case 'error while running tsc': return p_.option($, ($) => $p.concise
                ? sh.pg.sentences([])
                : sh.pg.sentences([
                    sh.sentence([
                        sh.ph.text("error while running tsc: "),
                        sh.ph.indent(sh.pg.sentences([
                            sh.sentence([
                                t_espe_to_paragraph.Error($),
                            ])
                        ]))
                    ]),
                    //
                ])
            )
            default: return p_.exhaustive($[0])
        }
    })