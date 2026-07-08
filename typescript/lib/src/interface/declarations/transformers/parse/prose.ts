
import type * as p_i from 'pareto-core/interface/transformer'

//data types
import type * as d_in from "../../../data/parse.js"
import type * as d_out from "pareto-fountain-pen/interface/generated/liana/schemas/prose/data"




    export type Error = p_i.Transformer<
        d_in.Error,
        d_out.Phrase
    >

