
import type * as p_ from 'pareto-core/interface/transformer'

//data types
import type * as s_in from "../../../interface/schemas/file_structure_analysis.js"
import type * as s_out from "pareto-csv/interface/data/csv"

export type Signature = p_.Transformer<
    s_in.File_Analysis_List,
    s_out.CSV
>

