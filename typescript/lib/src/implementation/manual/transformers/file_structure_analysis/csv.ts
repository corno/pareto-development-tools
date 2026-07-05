import * as p_ from 'pareto-core/implementation/transformer'
import * as p_i from 'pareto-core/interface/transformer'

//data types
import * as d_in from "../../../../interface/data/file_structure_analysis.js"
import * as d_out from "../../../../modules/csv/interface/data/csv.js"

//dependencies
import * as t_to_text from "./text.js"

export type Signature = p_i.Transformer<
    d_in.File_Analysis_List,
    d_out.CSV
>

export const File_Analysis_List: Signature = ($) => p_.literal.segmented_list([
    p_.literal.list([
        p_.literal.list([
            "package",
            "filepath",
            "structure path",
            "classification",
            "extension",
            "unexpected",
            "line count",
        ]),
    ]),
    p_.from.list($).map(
        ($) => p_.literal.list<string>([
            $.package,
            $.path,
            t_to_text.Path($.analysis.structure.path),
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
                                    default: return p_.au($[0])
                                }
                            }))
                        case 'file': return p_.option($, ($) => "file " + p_.from.state($).decide(
                            ($): string => {
                                switch ($[0]) {
                                    case 'generated': return p_.option($, ($) => "generated")
                                    case 'manual': return p_.option($, ($) => "manual")
                                    default: return p_.au($[0])
                                }
                            }))
                    }
                }),
            p_.from.optional($.analysis.extension).decide(
                ($) => $, () => ""),
            p_.from.optional($.analysis['unexpected path tail']).decide(
                ($) => t_to_text.Path($),
                () => ""
            ),
            `${$.analysis['line count']}`, //number to string
        ])
    )
])