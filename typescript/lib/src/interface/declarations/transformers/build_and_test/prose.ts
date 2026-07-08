
import type * as p_ from 'pareto-core/interface/transformer'

//data types
import type * as d_in from "../../../data/build_and_test.js"
import type * as d_out from "pareto-fountain-pen/interface/generated/liana/schemas/prose/data"

//shorthands
import * as sh from "pareto-fountain-pen/shorthands/prose/deprecated"

//dependencies
import * as t_build_to_prose from "../build/prose.js"
import * as t_epe_to_prose from "pareto-resources/implementation/manual/transformers/execute_command_executable/prose"



export type Error = p_.Transformer_With_Parameter<
    d_in.Error,
    d_out.Phrase,
    {
        'concise': boolean
    }
>

