
import type * as p_ from 'pareto-core/interface/transformer'


//data types
import type * as d_in from "../../../interface/schemas/get_package_dependencies.js"
import type * as d_out from "pareto-graphviz/interface/data/high_level_simple"
import type * as d_out_attributes from "pareto-graphviz/interface/data/attributes"


export type Result = p_.Transformer<
    d_in.Result,
    d_out.Graph
>

