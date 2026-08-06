import * as p_ from 'pareto-core/implementation/transformer'

//schemas

import type * as s_in from "../schema.js"

namespace declarations {
    export type line_count = p_.Transformer<
        s_in.List_Of_Characters,
        number
    >
}

export const line_count: declarations.line_count = ($) => {
    let lineCount = 0
    p_.from.list(
        $
    ).map(
        ($) => {
            if ($ === 10) { //newline character
                lineCount++
            }
            return null
        })
    return lineCount + 1 //add one for the last line if it doesn't end with a newline
}