
import type * as p_ from 'pareto-core/interface/transformer'

//data types
import type * as s_in from "../../../interface/schemas/file_structure_analysis.js"
import type * as s_out from "pareto-fountain-pen/interface/data/text"


export type Path = p_.Transformer<
    s_in.Path,
    s_out.Text
>

