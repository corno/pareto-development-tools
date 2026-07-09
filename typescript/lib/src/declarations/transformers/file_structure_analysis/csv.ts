
import type * as p_ from 'pareto-core/interface/transformer'

//data types
import type * as d_in from "../../../interface/data/file_structure_analysis.js"
import type * as d_out from "pareto-csv/interface/data/csv"

export type Signature = p_.Transformer<
    d_in.File_Analysis_List,
    d_out.CSV
>

