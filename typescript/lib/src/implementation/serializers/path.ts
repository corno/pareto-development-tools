import * as p_ from 'pareto-core/implementation/serializer'
import p_text_from_list from 'pareto-core/implementation/transformer/specials/text_from_list'
import p_list_from_text from 'pareto-core/implementation/refiner/specials/list_from_text'

//schemas
import type * as s_in from "../../interface/schemas/path.js"

namespace declarations {
    export type Path = p_.Serializer<
        s_in.Path
    >
}

export const Path: declarations.Path = ($) => p_.ph.list(
    p_.from.list($).flatten(
        ($) => p_.literal.list([
            p_.ph.literal("/"),
            p_.ph.literal($)
        ])
    )
)