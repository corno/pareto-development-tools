import * as pt from 'pareto-core/dist/transformer/implementation'
import * as p_i from 'pareto-core/dist/transformer/interface'

//data types
import * as d_in from "../../../../interface/to_be_generated/file_structure_analysis"
import * as d_out from "../../../../modules/csv/interface/to_be_generated/csv"

export type Signature = p_i.Transformer<
    d_in.File_Analysis_List,
    d_out.CSV
>

export const File_Analysis_List: Signature = ($) => pt.literal.nested_list([
    [
        pt.literal.list([
            "package",
            "filepath",
            "structure path",
            "classification",
            "extension",
            "unexpected",
            "line count",
        ]),
    ],
    pt.list.from.list(
        $,
    ).map(
        ($) => pt.literal.list([
            $.package,
            $.path,
            $.analysis.structure.path,
            pt.decide.state($.analysis.structure.classification, ($) => {
                switch ($[0]) {
                    case 'directory': return pt.ss($, ($) => "directory " + pt.decide.state($, ($): string => {
                        switch ($[0]) {
                            case 'ignored': return pt.ss($, ($) => "ignored")
                            case 'generated': return pt.ss($, ($) => "generated")
                            case 'wildcards': return pt.ss($, ($) => "wildcards")
                            case 'dictionary': return pt.ss($, ($) => "dictionary")
                            case 'group': return pt.ss($, ($) => "group")
                            case 'freeform': return pt.ss($, ($) => "freeform")
                            default: return pt.au($[0])
                        }
                    }))
                    case 'file': return pt.ss($, ($) => "file " + pt.decide.state($, ($): string => {
                        switch ($[0]) {
                            case 'generated': return pt.ss($, ($) => "generated")
                            case 'manual': return pt.ss($, ($) => "manual")
                            default: return pt.au($[0])
                        }
                    }))
                }
            }),
            $.analysis.extension.__decide(($) => $, () => ""),
            $.analysis['unexpected path tail'].__decide(
                ($) => $,
                () => ""
            ),
            `${$.analysis['line count']}`, //number to string
        ])
    )
])