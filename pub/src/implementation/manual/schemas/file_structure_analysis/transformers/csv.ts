import * as _p from 'pareto-core/dist/assign'
import * as _pi from 'pareto-core/dist/interface'

//data types
import * as d_in from "../../../../../interface/to_be_generated/file_structure_analysis"
import * as d_out from "../../../../../modules/csv/interface/to_be_generated/csv"

export type Signature = _pi.Transformer<
    d_in.File_Analysis_List,
    d_out.CSV
>

export const File_Analysis_List: Signature = ($) => _p.list.nested_literal_old([
    [
        _p.list.literal([
            "package",
            "filepath",
            "structure path",
            "classification",
            "extension",
            "unexpected",
            "line count",
        ]),
    ],
    _p.list.from.list(
        $,
    ).map(
        ($): _pi.List<string> => _p.list.literal([
            $.package,
            $.path,
            $.analysis.structure.path,
            _p.decide.state($.analysis.structure.classification, ($) => {
                switch ($[0]) {
                    case 'directory': return _p.ss($, ($) => "directory " + _p.decide.state($, ($) => {
                        switch ($[0]) {
                            case 'ignored': return _p.ss($, ($) => "ignored")
                            case 'generated': return _p.ss($, ($) => "generated")
                            case 'wildcards': return _p.ss($, ($) => "wildcards")
                            case 'dictionary': return _p.ss($, ($) => "dictionary")
                            case 'group': return _p.ss($, ($) => "group")
                            case 'freeform': return _p.ss($, ($) => "freeform")
                            default: return _p.au($[0])
                        }
                    }))
                    case 'file': return _p.ss($, ($) => "file " + _p.decide.state($, ($) => {
                        switch ($[0]) {
                            case 'generated': return _p.ss($, ($) => "generated")
                            case 'manual': return _p.ss($, ($) => "manual")
                            default: return _p.au($[0])
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