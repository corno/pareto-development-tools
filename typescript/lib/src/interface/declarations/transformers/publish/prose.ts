
import type * as p_ from 'pareto-core/interface/transformer'

//data types
import type * as d_in from "../../../data/publish.js"
import type * as d_out from "pareto-fountain-pen/interface/generated/liana/schemas/prose/data"

//shorthands
import * as sh from "pareto-fountain-pen/shorthands/prose/deprecated"


export type Error = p_.Transformer<
    d_in.Error,
    d_out.Phrase
>

