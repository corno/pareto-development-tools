import * as p_ from 'pareto-core/refiner'

//schemas

import type * as s_in from "pareto-filesystem-unrestricted-api/modules/unrestricted/schemas/list_of_characters/schema"
import type * as s_out from "../schema.js"

namespace declarations {
    export type line_count = p_.Refiner_Without_Error<
        s_out.line_count,
        s_in.List_Of_Characters
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