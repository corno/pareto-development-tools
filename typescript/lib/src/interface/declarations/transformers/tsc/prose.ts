
import type * as p_ from 'pareto-core/interface/transformer'

//data types
import type * as d_in from "../../../data/tsc.js"
import type * as d_out from "pareto-fountain-pen/interface/generated/liana/schemas/prose/data"



export type Error = p_.Transformer_With_Parameter<
    d_in.Error,
    d_out.Paragraph,
    {
        'concise': boolean
    }
>

