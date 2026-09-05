import * as p_ from 'pareto-core/transformer'
import * as p_s from 'pareto-core/serializer'
import * as p_schema from 'pareto-core/schema'

//schemas
import type * as s_in from "../schema.js"
import type * as s_out from "pareto-csv/schemas/csv/schema"

namespace declarations {
    export type Signature = p_.Transformer<
        s_in.Project_File_Analysis_List,
        s_out.CSV
    >
}

//dependencies
import * as ser_path from "../../path/serializers.js"
import * as r_line_count_from_loc from "../../line_count/refiners/list_of_characters.js"

//shorthands
import * as sh from "pareto-csv/schemas/csv/shorthands/target"

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
    p_.from.list($).map_optionally(
        ($) => {
            const path = $.package
            const package_ = $.package
            return p_.from.state($.analysis).decide(
                ($): p_schema.Optional_Value<s_out.Row>  => {
                    switch ($[0]) {
                        case 'unexpected directory': return p_.option($, ($) => p_.literal.not_set())
                        case 'other': return p_.option($, ($) => p_.literal.not_set())
                        case 'file': return p_.option($, ($) => p_.literal.set(sh.row(p_.literal.list<string>([
                            package_,
                            path,
                            ser_path.Path($.structure.path),
                            p_.from.state($.structure.classification).decide(
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
                            p_.from.optional($.extension).decide(
                                ($) => $, () => ""),
                            p_.from.optional($['unexpected path tail']).decide(
                                ($) => ser_path.Path($),
                                () => ""
                            ),
                            `${r_line_count_from_loc.line_count($.content)}`, //number to string
                        ]))))
                        default: return p_.exhaustive($[0])
                    }
                }
            )
        }
    )
)