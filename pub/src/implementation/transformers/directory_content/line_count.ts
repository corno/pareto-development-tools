import * as _ea from 'exupery-core-alg'
import * as _et from 'exupery-core-types'

import * as d_in from "exupery-resources/dist/interface/algorithms/queries/directory_content"
import * as d_out from "../../../interface/temp_line_count"

import { $$ as op_flatten_directory } from "pareto-standard-operations/dist/implementation/algorithms/operations/pure/dictionary/flatten"

export const Directory = ($: d_in.Directory): d_out.Directory => {
    return $.map(($) => Node($))
}

export const Node = ($: d_in.Node): d_out.Node => {
    return _ea.cc($, ($) => {
        switch ($[0]) {
            case 'file': return _ea.ss($, ($) => _ea.cc(
                _ea.text_to_character_list($),
                ($) => ['file', _ea.block(() => {
                    let lineCount = 0
                    $.__for_each(($) => {
                        if ($ === 10) { //newline character
                            lineCount++
                        }
                    })
                    return lineCount + 1 //add one for the last line if it doesn't end with a newline
                })]
            ))
            case 'directory': return _ea.ss($, ($) => ['directory', Directory($)])
            case 'other': return _ea.ss($, ($) => ['other', null])
            default: return _ea.au($[0])
        }
    })
}

export const Directory2 = ($: d_out.Directory): d_out.Flattened_Directory_With_Line_Counts => {
    const temp: { [key: string]: number } = {}
    const x = ($: d_out.Directory, path: string): void => {
        $.map(($, key) => {

            _ea.cc($, ($) => {
                switch ($[0]) {
                    case 'other': return //do nothing, ignore other filesystem nodes for now
                    case 'file': return _ea.ss($, ($) => temp[`${path}/${key}`] = $)
                    case 'directory': return _ea.ss($, ($) => x($, `${path}/${key}`))
                    default: return _ea.au($[0])
                }
            })
        })

    }
    x($, ``)
    return _ea.dictionary_literal(temp)
}


export const dict_to_list = ($: d_out.Flattened_Directory_With_Line_Counts): _et.List<{
    'path': string,
    'line count': number,
}> => {
    return $.deprecated_to_array(() => 1).map(
        ($) => ({
            'path': $.key,
            'line count': $.value,
        }),
    )
}