
import type * as p_ from 'pareto-core/interface/transformer'


//data types
import type * as s_in from "../../../interface/schemas/get_package_dependencies.js"
import type * as s_out from "pareto-graphviz/interface/data/high_level_simple"
import type * as s_out_attributes from "pareto-graphviz/interface/data/attributes"


export type Result = p_.Transformer<
    s_in.Result,
    s_out.Graph
>

