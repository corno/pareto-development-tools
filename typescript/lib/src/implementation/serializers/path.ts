import * as p_ from 'pareto-core/implementation/serializer'
import p_text_from_list from 'pareto-core/implementation/transformer/specials/text_from_list'
import p_list_from_text from 'pareto-core/implementation/refiner/specials/list_from_text'

//schemas
import type * as s_in from "../../interface/schemas/path.js"

namespace declarations {
    export type Path = p_.Phrase_Serializer<
        s_in.Path
    >
}

import * as sh from "pareto-fountain-pen/shorthands/prose_simple/deprecated"

export const Path: declarations.Path = ($) => sh.ph.composed(
    p_.from.list($).flatten(
        ($) => p_.literal.list([
            sh.ph.literal("/"),
            sh.ph.literal($)
        ])
    )
)