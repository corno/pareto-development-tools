import * as p_ from 'pareto-core/serializer'

//schemas
import type * as s_in from "./schema.js"


export const Path: p_.Serializer<
        s_in.Path
    > = ($) => p_.ph.list(
    p_.from.list($).flatten(
        ($) => p_.literal.list([
            p_.ph.literal("/"),
            p_.ph.literal($)
        ])
    )
)