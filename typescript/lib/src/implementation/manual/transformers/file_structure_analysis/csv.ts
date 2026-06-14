import * as pt from 'pareto-core/dist/assign'
import * as p_di from 'pareto-core/dist/data/interface'
import * as p_ti from 'pareto-core/dist/transformer/interface'

//data types
import * as d_in from "../../../../interface/to_be_generated/file_structure_analysis"
import * as d_out from "../../../../modules/csv/interface/to_be_generated/csv"

export type Signature = p_ti.Transformer<
    d_in.File_Analysis_List,
    d_out.CSV
>

export const File_Analysis_List: Signature = ($) => pt.list.nested_literal_old([
    [
        pt.list.literal([
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
        ($): p_di.List<string> => pt.list.literal([
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