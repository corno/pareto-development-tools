import * as p_ from 'pareto-core/implementation/transformer'
import type * as p_i from 'pareto-core/interface/transformer'

import type * as d_in from "../../../../interface/data/build.js"
import type * as d_out from "pareto-fountain-pen/interface/generated/liana/schemas/prose/data"

export namespace interface_ {
    export type Error = p_i.Transformer_With_Parameter<
        d_in.Error,
        d_out.Phrase,
        {
            'concise': boolean
        }
    >
}
