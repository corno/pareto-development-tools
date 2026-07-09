import * as p_ from 'pareto-core/implementation/transformer'
import p_text_from_list from 'pareto-core/implementation/transformer/specials/text_from_list'
import p_list_from_text from 'pareto-core/implementation/refiner/specials/list_from_text'

import type * as interface_ from "../../../../declarations/transformers/file_structure_analysis/text.js"


export const Path: interface_.Path = ($) => p_text_from_list(
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