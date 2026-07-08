
import type * as p_i from 'pareto-core/interface/transformer'
import * as p_ from 'pareto-core/implementation/transformer'

//data types
import type * as d_in from "../../../data/get_package_dependencies.js"
import type * as d_out from "pareto-graphviz/interface/generated/liana/schemas/high_level_simple/data"
import type * as d_out_attributes from "pareto-graphviz/interface/generated/liana/schemas/attributes/data"

export namespace interface_ {
    export type Result = p_i.Transformer<
        d_in.Result,
        d_out.Graph
    >
}
