
import type * as p_ from 'pareto-core/interface/transformer'

//data types
import type * as d_in from "../../../interface/data/update_package_dependencies.js"
import type * as d_out from "pareto-fountain-pen/interface/generated/liana/schemas/prose/data"




export type Error = p_.Transformer<
    d_in.Error,
    d_out.Phrase
>


