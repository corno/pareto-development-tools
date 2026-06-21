import * as p_ from 'pareto-core/dist/implementation/transformer'
import * as p_i from 'pareto-core/dist/interface/transformer'

//data types
import * as d_in from "../../../../interface/data/file_structure_analysis"
import * as d_out from "../../../../modules/csv/interface/data/csv"

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
    p_.from.list(
        $,
    ).map(
        ($) => p_.literal.list([
            $.package,
            $.path,
            $.analysis.structure.path,
            p_.from.state($.analysis.structure.classification).decide(($) => {
                switch ($[0]) {
                    case 'directory': return p_.ss($, ($) => "directory " + p_.from.state($).decide(($): string => {
                        switch ($[0]) {
                            case 'ignored': return p_.ss($, ($) => "ignored")
                            case 'generated': return p_.ss($, ($) => "generated")
                            case 'wildcards': return p_.ss($, ($) => "wildcards")
                            case 'dictionary': return p_.ss($, ($) => "dictionary")
                            case 'group': return p_.ss($, ($) => "group")
                            case 'freeform': return p_.ss($, ($) => "freeform")
                            default: return p_.au($[0])
                        }
                    }))
                    case 'file': return p_.ss($, ($) => "file " + p_.from.state($).decide(($): string => {
                        switch ($[0]) {
                            case 'generated': return p_.ss($, ($) => "generated")
                            case 'manual': return p_.ss($, ($) => "manual")
                            default: return p_.au($[0])
                        }
                    }))
                }
            }),
            p_.from.optional($.analysis.extension).decide(($) => $, () => ""),
            p_.from.optional($.analysis['unexpected path tail']).decide(
                ($) => $,
                () => ""
            ),
            `${$.analysis['line count']}`, //number to string
        ])
    )
])