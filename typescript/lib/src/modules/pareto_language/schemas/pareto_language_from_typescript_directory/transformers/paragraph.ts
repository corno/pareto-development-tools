import * as p_ from 'pareto-core/transformer'

//schemas
import type * as s_in from "../schema.js"
import type * as s_path from "pareto-filesystem-unrestricted-api/modules/unrestricted/schemas/path/schema"
import type * as s_out from "pareto-fountain-pen/modules/paragraph/schemas/paragraph/schema"


namespace declarations {
    export type Error = p_.Transformer_With_Parameter<
        s_in.Error,
        s_out.Paragraph.sentences,
        {
            'context path': s_path.Context_Path
        }
    >
}

//dependencies

import * as ser_path from "pareto-filesystem-unrestricted-api/modules/unrestricted/schemas/path/serializers"

//shorthands
import * as sh from "pareto-fountain-pen/modules/paragraph/schemas/paragraph/shorthands/deprecated"

export const Error: declarations.Error = ($, $p) => p_.from.state($).decide(
    ($): s_out.Paragraph.sentences => {
        switch ($[0]) {
            case 'no such node': return p_.option($, ($) =>
                p_.literal.list([
                    sh.sentence([
                        sh.ph.text("no such node: " + $.name + " in " + ser_path.Context_Path($p['context path']) + $['internal path'])
                    ])
                ])
            )
            case 'not a directory': return p_.option($, ($) => p_.literal.list([
                sh.sentence([
                    sh.ph.text("not a directory: " + ser_path.Context_Path($p['context path']) + $['internal path'] + "/" + $.name)
                ])
            ]))
            case 'not a file': return p_.option($, ($) => p_.literal.list([
                sh.sentence([
                    sh.ph.text("not a file: " + ser_path.Context_Path($p['context path']) + $['internal path'] + "/" + $.name)
                ])
            ]))
            case 'aggregated': return p_.option($, ($) => p_.from.list($.errors).flatten(
                ($) => Error($, $p)
            ))
            case 'unexpected construct': return p_.option($, ($) => p_.literal.list([
                sh.sentence([
                    sh.ph.text("unexpected construct: " + $.name + " in " + ser_path.Context_Path($p['context path']) + $['file location']['internal path'] + "/" + $['file location'].name + ":" + $['location in file']['line'] + ":" + $['location in file']['column'])
                ])
            ]))
            case 'typescript parsing failed': return p_.option($, ($) => p_.literal.list([
                sh.sentence([
                    sh.ph.text("typescript parsing failed: " + $.location)
                ])
            ]))
            default: return p_.exhaustive($[0])
        }
    }
)
