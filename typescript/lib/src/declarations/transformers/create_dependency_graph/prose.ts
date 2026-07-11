
import type * as p_ from 'pareto-core/interface/transformer'

//data types
import type * as s_in from "../../../interface/schemas/create_dependency_graph.js"
import type * as s_out from "pareto-fountain-pen/interface/data/prose"



export type Error = p_.Transformer<
    s_in.Error,
    s_out.Phrase
>


