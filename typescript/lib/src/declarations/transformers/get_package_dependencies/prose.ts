
import type * as p_ from 'pareto-core/interface/transformer'

import type * as s_in from "../../../interface/schemas/get_package_dependencies.js"
import type * as s_out from "pareto-fountain-pen/interface/data/prose"



export type Error = p_.Transformer<
    s_in.Error,
    s_out.Phrase
>


