import * as p_ from 'pareto-core/implementation/transformer'
import p_text_from_list from 'pareto-core/implementation/transformer/specials/text_from_list'
import p_list_from_text from 'pareto-core/implementation/refiner/specials/list_from_text'

//schemas
import type * as s_in from "../../../interface/schemas/file_structure_analysis.js"
import type * as s_out from "../../../interface/schemas/text.js"

namespace declarations {
    export type Path = p_.Transformer<
        s_in.Path,
        s_out.Text
    >
}


export const Path: declarations.Path = ($) => p_text_from_list(
    p_.from.list($).flatten(
        ($) => p_.literal.segmented_list([
            p_.literal.list([
                0x2F, // /
            ]),
            p_list_from_text(
                $,
                ($) => $
            )
        ])
    ),
    ($) => $,
)