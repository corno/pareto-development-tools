
import type * as p_ from 'pareto-core/interface/transformer'

//data types
import type * as d_in from "../../../interface/data/file_structure_analysis.js"
import type * as d_out from "pareto-fountain-pen/interface/data/text"


export type Path = p_.Transformer<
    d_in.Path,
    d_out.Text
>

