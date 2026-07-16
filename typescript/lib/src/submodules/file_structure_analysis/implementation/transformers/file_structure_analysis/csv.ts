import * as p_ from 'pareto-core/implementation/transformer'
import * as p_s from 'pareto-core/implementation/serializer'

//schemas
import type * as s_in from "../../../schemas/file_structure_analysis.js"
import type * as s_out from "../../../schemas/csv.js"

namespace declarations {
    export type Signature = p_.Transformer<
        s_in.File_Analysis_List,
        s_out.CSV
    >
}

//dependencies
import * as ser_path from "../../serializers/path.js"

//shorthands
import * as sh from "pareto-csv/shorthands/csv/target"

export const File_Analysis_List: declarations.Signature = ($) => sh.CSV(
    p_.literal.set(sh.row(p_.literal.list([
        "package",
        "filepath",
        "structure path",
        "classification",
        "extension",
        "unexpected",
        "line count",
    ]))),
    p_.from.list($).map(
        ($) => sh.row(p_.literal.list([
            $.package,
            $.path,
            ser_path.Path($.analysis.structure.path),
            p_.from.state($.analysis.structure.classification).decide(
                ($) => {
                    switch ($[0]) {
                        case 'directory': return p_.option($, ($) => "directory " + p_.from.state($).decide(
                            ($): string => {
                                switch ($[0]) {
                                    case 'ignored': return p_.option($, ($) => "ignored")
                                    case 'generated': return p_.option($, ($) => "generated")
                                    case 'wildcards': return p_.option($, ($) => "wildcards")
                                    case 'dictionary': return p_.option($, ($) => "dictionary")
                                    case 'group': return p_.option($, ($) => "group")
                                    case 'freeform': return p_.option($, ($) => "freeform")
                                    default: return p_.exhaustive($[0])
                                }
                            }))
                        case 'file': return p_.option($, ($) => "file " + p_.from.state($).decide(
                            ($): string => {
                                switch ($[0]) {
                                    case 'generated': return p_.option($, ($) => "generated")
                                    case 'manual': return p_.option($, ($) => "manual")
                                    default: return p_.exhaustive($[0])
                                }
                            }))
                    }
                }),
            p_.from.optional($.analysis.extension).decide(
                ($) => $, () => ""),
            p_.from.optional($.analysis['unexpected path tail']).decide(
                ($) => ser_path.Path($),
                () => ""
            ),
            `${$.analysis['line count']}`, //number to string
        ]))
    )
)