
import type * as p_ from 'pareto-core/interface/transformer'

import type * as d_in from "../../../data/get_package_dependencies.js"
import type * as d_out from "pareto-fountain-pen/interface/generated/liana/schemas/prose/data"



export type Error = p_.Transformer<
    d_in.Error,
    d_out.Phrase
>


