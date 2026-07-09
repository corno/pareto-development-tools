
import type * as p_ from 'pareto-core/interface/transformer'

import type * as d_in from "../../../interface/data/build.js"
import type * as d_out from "pareto-fountain-pen/interface/generated/liana/schemas/prose/data"


export type Error = p_.Transformer_With_Parameter<
    d_in.Error,
    d_out.Phrase,
    {
        'concise': boolean
    }
>

