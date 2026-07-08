
import type * as p_ from 'pareto-core/interface/transformer'

//data types
import type * as d_in from "../../../data/file_structure_analysis.js"
import type * as d_out from "../../../../modules/csv/interface/data/csv.js"

//dependencies
import * as t_to_text from "./text.js"



    export type Signature = p_.Transformer<
        d_in.File_Analysis_List,
        d_out.CSV
    >

